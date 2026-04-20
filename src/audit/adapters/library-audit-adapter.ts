import {
  npmAudit,
  pnpmAudit,
  yarnAudit,
  type AuditCiConfig,
  type Summary as AuditCiSummary,
} from "audit-ci";

import {
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_REPORT_TYPE,
} from "../constants.js";
import { AuditExecutionError } from "../errors.js";
import type {
  AuditCiAdapterInput,
  AuditCiAdapterResult,
  AuditThreshold,
  PackageManager,
} from "../types.js";

function mapThresholdToConfig(threshold: AuditThreshold) {
  // audit-ci 的阈值配置是多个布尔字段，而不是单个 severity 字段。
  // 这里把我们自己的统一 threshold 选项转换成 audit-ci 需要的配置格式。
  return {
    low: threshold === "low",
    moderate: threshold === "moderate",
    high: threshold === "high",
    critical: threshold === "critical",
  };
}

function getAuditor(packageManager: PackageManager) {
  // npm / pnpm / yarn 在 audit-ci 内部对应不同的执行器。
  // 这里集中做一次映射，避免业务层直接感知第三方库的实现细节。
  switch (packageManager) {
    case "npm":
      return npmAudit;
    case "pnpm":
      return pnpmAudit;
    case "yarn":
      return yarnAudit;
    default:
      throw new AuditExecutionError(
        `Unsupported package manager: ${packageManager}`
      );
  }
}

async function runAuditSilently<T>(task: () => Promise<T>) {
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);

  // audit-ci 的库模式即使提供了 reporter，仍可能把原始 JSON 直接打印到终端。
  // 这里在 adapter 层暂时静默标准输出，只把最终整理后的结果交给上层测试入口展示。
  process.stdout.write = (() => true) as typeof process.stdout.write;
  process.stderr.write = (() => true) as typeof process.stderr.write;

  try {
    return await task();
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
  }
}

export async function runLibraryAuditAdapter(
  input: AuditCiAdapterInput
): Promise<AuditCiAdapterResult> {
  // 这个 adapter 只负责“库模式”可稳定工作的场景。
  // 当前主要用于 npm / pnpm；Yarn 因为拿不到完整 payload，已经拆到专用 adapter。
  const auditor = getAuditor(input.detection.packageManager);
  let capturedAudit: unknown | null = null;

  // npm / pnpm 会把 parsedOutput 传给 reporter；
  // yarn 在库模式下通常只会回传 summary，不会提供第三个参数。
  const reporter = (
    summary: AuditCiSummary,
    _config: unknown,
    audit?: unknown
  ): AuditCiSummary => {
    capturedAudit = audit ?? null;
    return summary;
  };

  // 这里把 audit-ci 需要的配置统一拼好，外层 service 只负责提供业务输入，
  // 不需要知道 audit-ci 的具体字段名和布尔阈值规则。
  const config: AuditCiConfig = {
    ...mapThresholdToConfig(input.threshold),
    allowlist: input.allowlist,
    directory: input.detection.directory,
    "package-manager": input.detection.packageManager,
    "output-format": DEFAULT_OUTPUT_FORMAT,
    "report-type": DEFAULT_REPORT_TYPE,
    "skip-dev": input.skipDev,
    "retry-count": input.retryCount,
    "pass-enoaudit": input.passEnoAudit,
    registry: input.registry,
    "extra-args": input.extraArgs ?? [],
    "show-found": true,
    "show-not-found": true,
  };

  try {
    // 统一通过 reporter 截获 audit-ci 底层返回，后续再交给归一化层处理。
    const summary = await runAuditSilently(() => auditor(config, reporter));

    return {
      auditSummary: summary,
      auditPayload: capturedAudit,
    };
  } catch (error) {
    // 这里统一把第三方库抛出的异常包装成项目自己的错误类型，
    // 这样 MCP 层和测试入口都能用同一套错误语义处理。
    const message =
      error instanceof Error ? error.message : "audit-ci execution failed";

    throw new AuditExecutionError(
      `audit-ci failed for ${input.detection.packageManager} using ${input.detection.lockfileName}: ${message}`,
      error
    );
  }
}
