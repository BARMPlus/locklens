import path from "node:path";

import ejs from "ejs";
import { SEVERITY_LABELS_EN, textReportTemplateEn } from "./text-report.en";
import { SEVERITY_LABELS_ZH, textReportTemplateZh } from "./text-report.zh";

import type {
  AuditOutputFormatLanguage,
  PackageAuditAdvisory,
  PackageAuditResult,
  SupportedSeverity,
} from "../types";

const SEVERITY_ORDER: SupportedSeverity[] = [
  "critical",
  "high",
  "moderate",
  "low",
  "info",
];

const SUMMARY_SEVERITY_ORDER: SupportedSeverity[] = [
  "critical",
  "high",
  "moderate",
  "low",
];

interface TextReportSeverityGroup {
  severity: SupportedSeverity;
  label: string;
  count: number;
}

interface TextReportAdvisoryView {
  id: string;
  moduleHeading: string;
  titleLine: string;
  severityLabel: string;
  url: string;
  isAllowlisted: boolean;
  pathLines: string[];
}

// 语言差异统一收敛在这里，后续新增语言时只需要扩展语言配置和这个分发函数。
function getSeverityLabels(language: AuditOutputFormatLanguage) {
  return language === "en" ? SEVERITY_LABELS_EN : SEVERITY_LABELS_ZH;
}

function getTargetName(result: PackageAuditResult) {
  if (result.runtime.sourceType === "remote") {
    const lastSegment = result.runtime.source.split("/").pop() ?? result.runtime.source;
    return lastSegment.replace(/\.git$/i, "") || result.runtime.source;
  }

  return path.basename(result.runtime.directory) || result.runtime.directory;
}

function getSeverityLabel(
  severity: SupportedSeverity | null,
  language: AuditOutputFormatLanguage
) {
  // 原始 advisory 在个别场景下可能拿不到 severity，这里统一提供模板兜底文本。
  if (!severity) {
    return language === "en" ? "Unknown" : "未知";
  }

  return getSeverityLabels(language)[severity];
}

function formatDependencyPath(dependencyPath: string) {
  // 依赖链统一格式化成 Markdown 行内代码，保持中英文模板输出结构一致。
  return dependencyPath
    .split(">")
    .filter(Boolean)
    .map((segment) => `\`${segment}\``)
    .join(" / ");
}

function buildSeverityGroups(
  result: PackageAuditResult,
  language: AuditOutputFormatLanguage
): TextReportSeverityGroup[] {
  const severityLabels = getSeverityLabels(language);

  // 顶部风险分布只展示四级风险，和当前产品展示约定保持一致。
  return SUMMARY_SEVERITY_ORDER.map((severity) => ({
    severity,
    label: severityLabels[severity],
    count: result.metadata.vulnerabilities[severity] ?? 0,
  }));
}

function buildAdvisoryView(
  advisory: PackageAuditAdvisory,
  language: AuditOutputFormatLanguage
): TextReportAdvisoryView {
  return {
    id: advisory.id,
    moduleHeading: advisory.moduleName ? `\`${advisory.moduleName}\`` : `\`${advisory.id}\``,
    titleLine:
      advisory.title ?? (language === "en" ? "Title not available" : "未返回标题"),
    severityLabel: getSeverityLabel(advisory.severity, language),
    url: advisory.url,
    isAllowlisted: advisory.isAllowlisted,
    pathLines: advisory.paths.map(formatDependencyPath),
  };
}

function buildAdvisoryGroups(
  result: PackageAuditResult,
  language: AuditOutputFormatLanguage
) {
  const severityLabels = getSeverityLabels(language);

  // 详细列表继续使用 threshold 过滤后的 advisories，不回退到完整漏洞总量。
  return SEVERITY_ORDER.map((severity) => ({
    severity,
    label: severityLabels[severity],
    items: result.advisories
      .filter((advisory) => advisory.severity === severity)
      .map((advisory) => buildAdvisoryView(advisory, language)),
  })).filter((group) => group.items.length > 0);
}

function buildDisplayedSeverityLabels(
  result: PackageAuditResult,
  language: AuditOutputFormatLanguage
) {
  const severityLabels = getSeverityLabels(language);
  const labels = result.metadata.thresholdSeverities.map(
    (severity) => severityLabels[severity]
  );

  return labels.length > 0 ? labels.join(language === "en" ? ", " : "、") : language === "en" ? "None" : "无";
}

function buildMinimumDisplayedSeverityLabel(
  result: PackageAuditResult,
  language: AuditOutputFormatLanguage
) {
  const minimumSeverity = result.metadata.thresholdSeverities[0];

  return minimumSeverity
    ? getSeverityLabels(language)[minimumSeverity]
    : language === "en"
      ? "None"
      : "无";
}

function getTemplate(language: AuditOutputFormatLanguage) {
  // 模板内容已经拆到独立语言文件，这里只保留语言到模板的映射关系。
  return language === "en" ? textReportTemplateEn : textReportTemplateZh;
}

export function renderTextReport(
  result: PackageAuditResult,
  language: AuditOutputFormatLanguage = "zh"
) {
  // 共享渲染入口只负责准备与语言无关的数据，再交给对应语言模板渲染。
  return ejs
    .render(getTemplate(language), {
      targetName: getTargetName(result),
      runtime: result.runtime,
      total: result.metadata.vulnerabilities.total ?? 0,
      filteredTotal: result.metadata.vulnerabilities.filteredTotal ?? 0,
      advisories: result.advisories,
      severityGroups: buildSeverityGroups(result, language),
      advisoryGroups: buildAdvisoryGroups(result, language),
      displayedSeverityLabels: buildDisplayedSeverityLabels(result, language),
      minimumDisplayedSeverityLabel: buildMinimumDisplayedSeverityLabel(result, language),
    })
    .trimEnd();
}
