import type {
  AuditThreshold,
  PackageAuditAdvisory,
  PackageAuditMetadata,
  SupportedSeverity,
  VulnerabilityCounts,
} from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(
  record: Record<string, unknown>,
  key: string
): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
}

function readNestedRecord(
  record: Record<string, unknown>,
  key: string
): Record<string, unknown> | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function normalizeVulnerabilities(
  advisories: PackageAuditAdvisory[]
): VulnerabilityCounts {
  const counts = {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    total: 0,
  };

  for (const advisory of advisories) {
    if (!advisory.severity) {
      continue;
    }

    counts[advisory.severity] += 1;
    counts.total += 1;
  }

  return {
    info: counts.info,
    low: counts.low,
    moderate: counts.moderate,
    high: counts.high,
    critical: counts.critical,
    // total 现在和去重后的 advisory 列表保持一致，不再使用底层原始条目总数。
    total: counts.total,
    filteredTotal: null,
  };
}

function normalizeThresholdSeverities(
  threshold: AuditThreshold
): AuditThreshold[] {
  const severityRank: Record<AuditThreshold, number> = {
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
  };

  // 这个字段用于明确告诉前端：当前 threshold 会保留哪些级别。
  // 例如 threshold = moderate 时，前端直接拿到 ["moderate", "high", "critical"]，
  // 不需要再自己维护一套映射规则。
  return (["low", "moderate", "high", "critical"] as AuditThreshold[]).filter(
    (severity) => severityRank[severity] >= severityRank[threshold]
  );
}

function countFilteredVulnerabilities(
  advisories: PackageAuditAdvisory[],
  threshold: AuditThreshold
) {
  const severityRank: Record<AuditThreshold | "info", number> = {
    info: 0,
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
  };

  return advisories.filter((advisory) => {
    const severity = advisory.severity;

    if (!severity) {
      return false;
    }

    return severityRank[severity as SupportedSeverity] >= severityRank[threshold];
  }).length;
}

export function normalizeMetadata(
  rawAudit: unknown,
  advisories: PackageAuditAdvisory[],
  threshold: AuditThreshold
): PackageAuditMetadata {
  const vulnerabilities = normalizeVulnerabilities(advisories);
  vulnerabilities.filteredTotal = countFilteredVulnerabilities(advisories, threshold);

  if (!isRecord(rawAudit)) {
    // yarn 通过库方式接入时，很多场景下没有完整 raw audit 对象。
    // 这时 metadata 只能明确表达“未知”，不能强行补默认统计值。
    return {
      vulnerabilities,
      thresholdSeverities: normalizeThresholdSeverities(threshold),
      dependencies: null,
      devDependencies: null,
      optionalDependencies: null,
      totalDependencies: null,
    };
  }

  // npm / pnpm 的原始结果通常会把统计信息挂在 metadata 下。
  // 我们尽量读取；没有的字段就保持 null，方便前端按“缺失”处理。
  const metadata = readNestedRecord(rawAudit, "metadata");
  const dependencyContainer = metadata ? readNestedRecord(metadata, "dependencies") : null;
  const dependencies = metadata ? readNumber(metadata, "dependencies") : null;
  const devDependencies = metadata ? readNumber(metadata, "devDependencies") : null;
  const optionalDependencies = metadata
    ? readNumber(metadata, "optionalDependencies")
    : null;
  const totalDependencies = metadata ? readNumber(metadata, "totalDependencies") : null;

  return {
    vulnerabilities,
    thresholdSeverities: normalizeThresholdSeverities(threshold),
    // 不同包管理器在 metadata 里的依赖统计结构不完全一致：
    // 有的直接平铺在 metadata 下，有的会嵌套在 dependencies 对象里。
    dependencies:
      dependencies ?? (dependencyContainer ? readNumber(dependencyContainer, "dependencies") : null),
    devDependencies:
      devDependencies ??
      (dependencyContainer ? readNumber(dependencyContainer, "devDependencies") : null),
    optionalDependencies:
      optionalDependencies ??
      (dependencyContainer
        ? readNumber(dependencyContainer, "optionalDependencies")
        : null),
    totalDependencies:
      totalDependencies ??
      (dependencyContainer
        ? readNumber(dependencyContainer, "total")
        : null),
  };
}
