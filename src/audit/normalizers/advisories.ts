import { gitHubAdvisoryIdToUrl, gitHubAdvisoryUrlToAdvisoryId } from "audit-ci";

import type {
  AuditThreshold,
  NormalizerContext,
  PackageAuditAdvisory,
  SupportedSeverity,
} from "../types.js";

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

function readPathsFromSummary(summaryPaths: string[]) {
  const pathMap = new Map<string, string[]>();

  for (const advisoryPath of summaryPaths) {
    // audit-ci 会把路径整理成：
    // GHSA-xxxx|pkgA>pkgB>pkgC
    // 这里把它拆成 “漏洞 id -> 命中的依赖路径列表” 的映射，后续复用更方便。
    const [id, path = ""] = advisoryPath.split("|");
    const paths = pathMap.get(id) ?? [];

    if (path) {
      paths.push(path);
    }

    pathMap.set(id, paths);
  }

  return pathMap;
}

function inferModuleNameFromPaths(paths: string[]) {
  const firstPath = paths[0];

  if (!firstPath) {
    return null;
  }

  const [moduleName = null] = firstPath.split(">");
  return moduleName;
}

function ensureAdvisory(
  advisories: Map<string, PackageAuditAdvisory>,
  id: string,
  paths: string[],
  isAllowlisted: boolean
) {
  // 先创建一个最小可用 advisory 对象。
  // 后面如果从 raw 里读到了更完整的信息，再逐步补齐 severity、title、moduleName。
  if (!advisories.has(id)) {
    advisories.set(id, {
      id,
      severity: null,
      moduleName: inferModuleNameFromPaths(paths),
      title: null,
      url: gitHubAdvisoryIdToUrl(id),
      paths,
      isAllowlisted,
    });
  }

  return advisories.get(id)!;
}

function mergePaths(target: string[], paths: string[]) {
  // 不同来源可能会把同一条 advisory 的路径重复补进来，这里统一去重。
  return [...new Set([...target, ...paths])].sort();
}

function normalizeAdvisoriesMap(
  advisories: Map<string, PackageAuditAdvisory>,
  rawAudit: Record<string, unknown>,
  pathMap: Map<string, string[]>,
  allowlistedIds: Set<string>
) {
  const advisoryMap = rawAudit.advisories;

  if (!isRecord(advisoryMap)) {
    return;
  }

  // npm v1 / pnpm 更接近这类结构：顶层有 advisories 映射。
  for (const [key, value] of Object.entries(advisoryMap)) {
    if (!isRecord(value)) {
      continue;
    }

    const id =
      readString(value, "github_advisory_id") ??
      (() => {
        const url = readString(value, "url");
        return url ? gitHubAdvisoryUrlToAdvisoryId(url) : key;
      })();
    const paths = pathMap.get(id) ?? [];
    const advisory = ensureAdvisory(advisories, id, paths, allowlistedIds.has(id));
    const findings = value.findings;

    advisory.severity = isSupportedSeverity(value.severity)
      ? value.severity
      : advisory.severity;
    advisory.moduleName = readString(value, "module_name") ?? advisory.moduleName;
    advisory.title = readString(value, "title") ?? advisory.title;
    advisory.url = readString(value, "url") ?? advisory.url;

    if (Array.isArray(findings)) {
      // findings.paths 是最具体的命中路径来源，优先合并进最终结果。
      const findingPaths = findings.flatMap((finding) => {
        if (!isRecord(finding) || !Array.isArray(finding.paths)) {
          return [];
        }

        return finding.paths.filter(
          (findingPath): findingPath is string => typeof findingPath === "string"
        );
      });

      advisory.paths = mergePaths(advisory.paths, findingPaths);
    }
  }
}

function normalizeVulnerabilitiesMap(
  advisories: Map<string, PackageAuditAdvisory>,
  rawAudit: Record<string, unknown>,
  pathMap: Map<string, string[]>,
  allowlistedIds: Set<string>
) {
  const vulnerabilities = rawAudit.vulnerabilities;

  if (!isRecord(vulnerabilities)) {
    return;
  }

  // npm 新版更偏向 vulnerabilities 结构，漏洞信息会挂在 via 里。
  for (const [moduleName, value] of Object.entries(vulnerabilities)) {
    if (!isRecord(value) || !Array.isArray(value.via)) {
      continue;
    }

    for (const via of value.via) {
      if (!isRecord(via)) {
        continue;
      }

      const url = readString(via, "url");
      const source = readString(via, "source");

      if (!url && !source) {
        continue;
      }

      const id = url ? gitHubAdvisoryUrlToAdvisoryId(url) : source!;
      const paths = pathMap.get(id) ?? [];
      const advisory = ensureAdvisory(advisories, id, paths, allowlistedIds.has(id));

      advisory.severity = isSupportedSeverity(via.severity)
        ? via.severity
        : advisory.severity;
      advisory.moduleName =
        readString(via, "name") ?? moduleName ?? advisory.moduleName;
      advisory.title = readString(via, "title") ?? advisory.title;
      advisory.url = url ?? advisory.url;
    }
  }
}

export function normalizeAdvisories(
  context: NormalizerContext
): PackageAuditAdvisory[] {
  const advisories = new Map<string, PackageAuditAdvisory>();
  // 不同包管理器的原始 JSON 差异很大，但 audit-ci summary 已经帮我们把
  // “漏洞 id + 命中路径” 这层抽象统一了，所以这里优先使用 summary 做主干数据源。
  const pathMap = readPathsFromSummary(context.auditSummary.advisoryPathsFound);
  const allowlistedIds = new Set(context.auditSummary.allowlistedAdvisoriesFound);

  if (isRecord(context.auditPayload)) {
    // 如果底层 audit 结果可用，就用它补齐更多展示字段。
    // 这一步对 npm / pnpm 收益最大，对 yarn 则允许天然缺失。
    normalizeAdvisoriesMap(
      advisories,
      context.auditPayload,
      pathMap,
      allowlistedIds
    );
    normalizeVulnerabilitiesMap(
      advisories,
      context.auditPayload,
      pathMap,
      allowlistedIds
    );
  }

  // 最后再用 summary 做兜底，确保即使 raw 不完整，漏洞列表也不会丢。
  for (const id of context.auditSummary.advisoriesFound) {
    const paths = pathMap.get(id) ?? [];
    const advisory = ensureAdvisory(advisories, id, paths, allowlistedIds.has(id));
    advisory.moduleName = advisory.moduleName ?? inferModuleNameFromPaths(paths);
  }

  return [...advisories.values()].sort((left, right) =>
    left.id.localeCompare(right.id)
  );
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

export function filterAdvisoriesByThreshold(
  advisories: PackageAuditAdvisory[],
  threshold: AuditThreshold
) {
  // metadata 统计会基于完整去重列表计算；这里只负责最终展示层的 threshold 过滤。
  return advisories.filter((advisory) =>
    severityMeetsThreshold(advisory.severity, threshold)
  );
}
