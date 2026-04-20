import { createWriteStream } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";
import os from "node:os";
import { finished } from "node:stream/promises";

import { gitHubAdvisoryUrlToAdvisoryId, type Summary as AuditCiSummary } from "audit-ci";

import { AuditExecutionError } from "../errors";
import type {
  AuditCiAdapterInput,
  AuditCiAdapterResult,
  AuditThreshold,
  SupportedSeverity,
} from "../types";

interface YarnAuditPayload {
  advisories: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
}

const DEFAULT_YARN_AUDIT_REGISTRY = "https://registry.npmjs.org/";
const YARN_AUDIT_TIMEOUT_MS = 60_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSupportedSeverity(value: unknown): value is SupportedSeverity {
  return (
    value === "info" ||
    value === "low" ||
    value === "moderate" ||
    value === "high" ||
    value === "critical"
  );
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function stripAnsi(input: string) {
  const ansiEscapePattern = new RegExp(String.raw`\u001b\[[0-9;]*m`, "g");
  return input.replace(ansiEscapePattern, "");
}

function collectJsonObjectsFromLines(stdout: string) {
  const jsonObjects: unknown[] = [];

  for (const line of stdout.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine.startsWith("{") || !trimmedLine.endsWith("}")) {
      continue;
    }

    try {
      jsonObjects.push(JSON.parse(trimmedLine));
    } catch {
      // audit-ci 的 stdout 偶尔会混入提示文本，忽略即可。
    }
  }

  return jsonObjects;
}

function collectJsonObjectsFromBlocks(stdout: string) {
  const jsonObjects: unknown[] = [];
  let depth = 0;
  let startIndex = -1;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < stdout.length; index += 1) {
    const character = stdout[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (character === "\\") {
        isEscaped = true;
        continue;
      }

      if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === "{") {
      if (depth === 0) {
        startIndex = index;
      }

      depth += 1;
      continue;
    }

    if (character === "}") {
      depth -= 1;

      if (depth === 0 && startIndex >= 0) {
        const jsonChunk = stdout.slice(startIndex, index + 1);

        try {
          jsonObjects.push(JSON.parse(jsonChunk));
        } catch {
          // 多个 JSON 对象首尾相连时，会走这里的兜底解析。
        }

        startIndex = -1;
      }
    }
  }

  return jsonObjects;
}

function collectJsonObjects(stdout: string) {
  const objectsFromLines = collectJsonObjectsFromLines(stdout);

  if (objectsFromLines.length > 0) {
    return objectsFromLines;
  }

  return collectJsonObjectsFromBlocks(stdout);
}

function normalizeClassicEventPayload(
  jsonObjects: unknown[]
): YarnAuditPayload | null {
  const advisories: Record<string, unknown> = {};
  let metadata: Record<string, unknown> | null = null;

  for (const jsonObject of jsonObjects) {
    if (!isRecord(jsonObject)) {
      continue;
    }

    // Yarn Classic 经 audit-ci full 输出后，通常是：
    // { type: "auditAdvisory", data: { resolution, advisory } }
    if (
      jsonObject.type === "auditAdvisory" &&
      isRecord(jsonObject.data) &&
      isRecord(jsonObject.data.advisory)
    ) {
      const advisory = jsonObject.data.advisory;
      const advisoryId =
        typeof advisory.id === "number" || typeof advisory.id === "string"
          ? String(advisory.id)
          : readString(advisory, "github_advisory_id");

      if (advisoryId) {
        advisories[advisoryId] = advisory;
      }

      continue;
    }

    if (
      jsonObject.type === "auditSummary" &&
      isRecord(jsonObject.data) &&
      isRecord(jsonObject.data.vulnerabilities)
    ) {
      metadata = jsonObject.data;
    }
  }

  if (Object.keys(advisories).length === 0 && metadata === null) {
    return null;
  }

  return {
    advisories,
    metadata,
  };
}

function normalizeImportantPayload(jsonObjects: unknown[]): YarnAuditPayload | null {
  const advisories: Record<string, unknown> = {};
  let metadata: Record<string, unknown> | null = null;

  for (const jsonObject of jsonObjects) {
    if (!isRecord(jsonObject)) {
      continue;
    }

    // 你手工执行 `npx audit-ci ... --report-type important --output-format json`
    // 产出的 `audit.json` 就是这一类结构：
    // { resolution, advisory }
    if (isRecord(jsonObject.advisory)) {
      const advisory = jsonObject.advisory;
      const advisoryId =
        typeof advisory.id === "number" || typeof advisory.id === "string"
          ? String(advisory.id)
          : readString(advisory, "github_advisory_id");

      if (advisoryId) {
        advisories[advisoryId] = advisory;
      }

      continue;
    }

    // Yarn Berry / 部分聚合输出会把 advisories 挂在顶层。
    if (isRecord(jsonObject.advisories)) {
      Object.assign(advisories, jsonObject.advisories);
    }

    // 最后一段一般是 metadata 或平铺统计对象。
    if (isRecord(jsonObject.metadata)) {
      metadata = jsonObject.metadata;
      continue;
    }

    if (isRecord(jsonObject.vulnerabilities)) {
      metadata = jsonObject;
    }
  }

  if (Object.keys(advisories).length === 0 && metadata === null) {
    return null;
  }

  return {
    advisories,
    metadata,
  };
}

function buildYarnAuditPayload(stdout: string) {
  const normalizedStdout = stripAnsi(stdout);
  const jsonObjects = collectJsonObjects(normalizedStdout);

  return (
    normalizeImportantPayload(jsonObjects) ??
    normalizeClassicEventPayload(jsonObjects)
  );
}

function readAdvisoryId(
  advisoryKey: string,
  advisory: Record<string, unknown>
) {
  const githubAdvisoryId = readString(advisory, "github_advisory_id");

  if (githubAdvisoryId) {
    return githubAdvisoryId;
  }

  const url = readString(advisory, "url");

  if (url?.includes("github.com/advisories/")) {
    return gitHubAdvisoryUrlToAdvisoryId(url);
  }

  return advisoryKey;
}

function readAdvisorySeverity(advisory: Record<string, unknown>) {
  const severity = advisory.severity;
  return isSupportedSeverity(severity) ? severity : null;
}

function readAdvisoryPaths(advisory: Record<string, unknown>) {
  const paths = new Set<string>();
  const findings = advisory.findings;

  if (!Array.isArray(findings)) {
    return [];
  }

  for (const finding of findings) {
    if (!isRecord(finding) || !Array.isArray(finding.paths)) {
      continue;
    }

    for (const findingPath of finding.paths) {
      if (typeof findingPath === "string" && findingPath.length > 0) {
        paths.add(findingPath);
      }
    }
  }

  return [...paths].sort();
}

function severityMeetsThreshold(
  severity: SupportedSeverity | null,
  threshold: AuditThreshold
) {
  const severityRank: Record<AuditThreshold | "info", number> = {
    info: 0,
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
  };

  if (!severity) {
    return false;
  }

  return severityRank[severity] >= severityRank[threshold];
}

function buildYarnSummary(
  payload: YarnAuditPayload,
  threshold: AuditThreshold
): AuditCiSummary {
  const advisoryIds = new Set<string>();
  const advisoryPaths = new Set<string>();
  const failedLevels = new Set<AuditThreshold>();

  for (const [advisoryKey, advisoryValue] of Object.entries(payload.advisories)) {
    if (!isRecord(advisoryValue)) {
      continue;
    }

    const advisoryId = readAdvisoryId(advisoryKey, advisoryValue);
    const severity = readAdvisorySeverity(advisoryValue);
    const paths = readAdvisoryPaths(advisoryValue);

    advisoryIds.add(advisoryId);

    for (const advisoryPath of paths) {
      advisoryPaths.add(`${advisoryId}|${advisoryPath}`);
    }

    if (
      severity &&
      severity !== "info" &&
      severityMeetsThreshold(severity, threshold)
    ) {
      failedLevels.add(severity as AuditThreshold);
    }
  }

  return {
    advisoriesFound: [...advisoryIds].sort(),
    advisoryPathsFound: [...advisoryPaths].sort(),
    failedLevelsFound: [...failedLevels].sort(),
    allowlistedAdvisoriesFound: [],
    allowlistedAdvisoriesNotFound: [],
    allowlistedModulesFound: [],
    allowlistedModulesNotFound: [],
    allowlistedPathsFound: [],
    allowlistedPathsNotFound: [],
  };
}

function buildAuditCiArgs(input: AuditCiAdapterInput) {
  const effectiveRegistry = input.registry ?? DEFAULT_YARN_AUDIT_REGISTRY;

  return [
    // 这里始终使用 `--low` 拉取完整漏洞集合，不能直接复用调用方传入的 threshold。
    // 原因是：
    // 1. 最终的 `advisories` 列表会在我们自己的 normalizer 里按 threshold 再过滤一次
    // 2. `metadata.vulnerabilities` 需要基于“完整去重后的漏洞集合”统计
    // 如果这里传 `--high` / `--critical`，Yarn CLI 返回的原始数据就已经被截断，
    // 后面再怎么归一化，也拿不到低等级漏洞了。
    "--low",
    "--report-type",
    "important",
    "--output-format",
    "json",
    "--registry",
    effectiveRegistry,
    ...(input.skipDev ? ["--skip-dev"] : []),
    ...(typeof input.retryCount === "number"
      ? ["--retry-count", String(input.retryCount)]
      : []),
    ...(input.passEnoAudit ? ["--pass-enoaudit"] : []),
    ...(input.extraArgs ?? []).flatMap((extraArg) => ["--extra-args", extraArg]),
  ];
}

function getAuditCiBinPath() {
  const require = createRequire(import.meta.url);
  const packageJsonPath = require.resolve("audit-ci/package.json");
  return path.join(path.dirname(packageJsonPath), "dist", "bin");
}

function createCleanAuditEnv() {
  // `yarn run` 会注入一批脚本生命周期变量，而这些变量会影响 audit-ci / Yarn
  // 对当前包管理器环境的判断，导致直接执行能成功、通过脚本执行却拿不到 JSON。
  // 这里不再采用“逐个删变量”的弱约束方式，而是收口成一组最小白名单，
  // 把之前外层 `env -i ...` 壳层的稳定性迁回到 Yarn adapter 内部。
  const cleanEnv: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    SHELL: process.env.SHELL,
    TERM: process.env.TERM ?? "xterm-256color",
    TMPDIR: process.env.TMPDIR ?? os.tmpdir(),
    PWD: process.env.PWD ?? process.cwd(),
  };

  // 网络代理、语言环境等基础变量如果当前进程存在，就按原值透传，
  // 避免在公司网络或特殊 shell 环境下出现额外的不确定性。
  for (const envKey of [
    "LANG",
    "LC_ALL",
    "LC_CTYPE",
    "USER",
    "LOGNAME",
    "TMP",
    "TEMP",
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "NO_PROXY",
    "http_proxy",
    "https_proxy",
    "no_proxy",
  ]) {
    const envValue = process.env[envKey];

    if (typeof envValue === "string" && envValue.length > 0) {
      cleanEnv[envKey] = envValue;
    }
  }

  return cleanEnv;
}

function createTempAuditFilePath(extension: string) {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return path.join(
    os.tmpdir(),
    `frontend-audit-yarn-${Date.now()}-${process.pid}-${randomSuffix}.${extension}`
  );
}

function buildAuditCiCommand(input: AuditCiAdapterInput) {
  const auditCiBinPath = getAuditCiBinPath();
  const args = buildAuditCiArgs(input);

  return {
    command: process.execPath,
    args: [auditCiBinPath, ...args],
  };
}

async function runAuditCiCommand(input: AuditCiAdapterInput): Promise<string> {
  const stdoutFilePath = createTempAuditFilePath("stdout.log");
  const stderrMessages: string[] = [];

  // Yarn 这条链路优先复用当前项目本地安装的 audit-ci 可执行文件，
  // 避免引入 npx 的额外解析和版本漂移问题。
  const auditCiCommand = buildAuditCiCommand(input);

  // 这里不再使用 `script` 去伪造终端环境。
  // 我们已经确认“直接执行本地 audit-ci + 落盘 stdout”能够拿到完整 JSON，
  // 而 `script` 反而会让 Yarn 提前结束，只留下 registry 提示。
  const processOutputStream = createWriteStream(stdoutFilePath, {
    encoding: "utf8",
  });
  const auditProcess = spawn(auditCiCommand.command, auditCiCommand.args, {
    cwd: input.detection.directory,
    env: createCleanAuditEnv(),
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });

  auditProcess.stdout.pipe(processOutputStream);
  auditProcess.stderr.setEncoding("utf8");
  auditProcess.stderr.on("data", (chunk) => {
    stderrMessages.push(stripAnsi(chunk));
  });

  const exitCode = await new Promise<number>((resolve, reject) => {
    // 脱离内网后，Yarn 可能因为解析私有包或网络重试一直不退出。
    // 这里必须加超时兜底，避免 MCP 调用卡死在 `close` 事件上。
    const timeoutId = setTimeout(() => {
      const stderr = stderrMessages.join("\n").trim();
      const timeoutError = new AuditExecutionError(
        stderr.length > 0
          ? `Yarn audit timed out after ${YARN_AUDIT_TIMEOUT_MS / 1000}s while auditing ${input.detection.lockfileName}. stderr: ${stderr}`
          : `Yarn audit timed out after ${YARN_AUDIT_TIMEOUT_MS / 1000}s while auditing ${input.detection.lockfileName}. 可能原因是 Yarn 在外网环境下重试私有包源或私有依赖审计请求。`
      );

      if (process.platform !== "win32" && typeof auditProcess.pid === "number") {
        try {
          process.kill(-auditProcess.pid, "SIGTERM");
        } catch {
          // 进程组可能已经结束，这里忽略即可。
        }
      } else {
        auditProcess.kill("SIGTERM");
      }

      setTimeout(() => {
        if (!auditProcess.killed) {
          if (process.platform !== "win32" && typeof auditProcess.pid === "number") {
            try {
              process.kill(-auditProcess.pid, "SIGKILL");
            } catch {
              // 兜底清理失败时不覆盖主错误。
            }
          } else {
            auditProcess.kill("SIGKILL");
          }
        }
      }, 2_000).unref();

      reject(timeoutError);
    }, YARN_AUDIT_TIMEOUT_MS);

    timeoutId.unref();

    auditProcess.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
    auditProcess.on("close", (code) => {
      clearTimeout(timeoutId);
      resolve(code ?? 0);
    });
  });

  // stdout 会在子进程结束后继续完成最后一段刷盘，这里需要显式等待写入结束，
  // 否则读取文件时可能只拿到半截 JSON。
  await finished(processOutputStream);

  let stdout = "";

  try {
    stdout = await readFile(stdoutFilePath, "utf8");
  } catch {
    // stdout 文件不存在时交给下面的统一错误分支处理。
  } finally {
    // 临时文件只用于接住 Yarn CLI 输出，解析后必须删除，避免污染系统临时目录。
    await rm(stdoutFilePath, { force: true }).catch(() => undefined);
  }

  // audit-ci 即使因为漏洞返回非 0，也依然会把完整 JSON 写入 stdout 文件。
  // 因此这里真正的成功标准不是 exit code，而是能否从输出中解析出 payload。
  const payload = buildYarnAuditPayload(stdout);

  if (payload) {
    return stdout;
  }

  const stderr = stderrMessages.join("\n").trim();
  const errorMessage =
    stderr.length > 0
      ? stderr
      : "audit-ci returned no parsable Yarn JSON output";

  throw new AuditExecutionError(
    `Yarn audit failed for ${input.detection.lockfileName} (exit code: ${exitCode}): ${errorMessage}`
  );
}

export async function runYarnCliAuditAdapter(
  input: AuditCiAdapterInput
): Promise<AuditCiAdapterResult> {
  try {
    const stdout = await runAuditCiCommand(input);
    const payload = buildYarnAuditPayload(stdout);

    if (!payload) {
      throw new AuditExecutionError("Yarn audit payload is empty");
    }

    return {
      auditSummary: buildYarnSummary(payload, input.threshold),
      auditPayload: {
        advisories: payload.advisories,
        metadata: payload.metadata,
      },
    };
  } catch (error) {
    if (error instanceof AuditExecutionError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Yarn audit execution failed";

    throw new AuditExecutionError(
      `Yarn audit failed for ${input.detection.lockfileName}: ${message}`,
      error
    );
  }
}
