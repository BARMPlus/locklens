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
} from "./constants.js";
import { AuditExecutionError } from "./errors.js";
import type {
  AuditCiAdapterInput,
  AuditCiAdapterResult,
  AuditThreshold,
  PackageManager,
} from "./types.js";

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
  // 按包管理器选择 audit-ci 暴露的对应库函数。
  // 这样 service 层无需关心 npm / yarn / pnpm 的调用差异。
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

export async function runAuditCiAdapter(
  input: AuditCiAdapterInput
): Promise<AuditCiAdapterResult> {
  const auditor = getAuditor(input.detection.packageManager);
  let capturedAudit: unknown | null = null;

  // audit-ci 的 reporter 是我们拿到底层结果的唯一入口。
  // npm / pnpm 会把解析后的审计对象传进来；
  // yarn 通过公开库 API 时通常只能稳定拿到 summary，所以这里要允许 audit 为空。
  const reporter = (
    summary: AuditCiSummary,
    _config: unknown,
    audit?: unknown
  ): AuditCiSummary => {
    capturedAudit = audit ?? null;
    return summary;
  };

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
    // 真正执行第三方审计逻辑的地方只保留在这一层。
    // 这样即使未来替换底层审计实现，service 和 normalizer 也不用跟着一起改。
    const summary = await auditor(config, reporter);

    return {
      auditSummary: summary,
      auditPayload: capturedAudit,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "audit-ci execution failed";

    // 统一把第三方错误包装成项目内错误类型，避免上层到处写兼容判断。
    throw new AuditExecutionError(
      `audit-ci failed for ${input.detection.packageManager} using ${input.detection.lockfileName}: ${message}`,
      error
    );
  }
}
