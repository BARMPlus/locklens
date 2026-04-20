import type { SupportedSeverity } from "../types";

// 中文模板配置单独拆分，方便后续独立维护中文术语和排版。
export const SEVERITY_LABELS_ZH: Record<SupportedSeverity, string> = {
  critical: "严重",
  high: "高危",
  moderate: "中危",
  low: "低危",
  info: "提示",
};

// 中文报告模板只使用通用 Markdown 语法，尽量保证绝大多数解析器都能稳定渲染。
export const textReportTemplateZh = String.raw`# \`<%= targetName %>\` 审计结果

## 审计概览

- 审计来源：<%= runtime.source %>
- lockFile：<%= runtime.lockfileName %>

---

## 风险分布

<%_ for (const group of severityGroups) { _%>
- **<%= group.label %>漏洞**：共计 **<%= group.count %>** 个
<%_ } _%>
- **风险漏洞总数**：**<%= total %>**

---

## 漏洞详情

> 当前展示的漏洞最低级别为<%= minimumDisplayedSeverityLabel %>，下面将展示<%= displayedSeverityLabels %>的错误信息，这些错误总数一共为<%= filteredTotal %>个。

<% if (advisories.length === 0) { %>
> 当前阈值下没有命中的漏洞条目。
<% } %>
<%_ for (const group of advisoryGroups) { _%>
### <%= group.label %>漏洞

共计 **<%= group.items.length %>** 个

<%_ for (const advisory of group.items) { _%>
#### <%= advisory.moduleHeading %>

- **标题**：<%= advisory.titleLine %>
- **漏洞编号**：<%= advisory.id %>
- **漏洞等级**：<%= advisory.severityLabel %>
- **漏洞详情**：<%= advisory.url %>
<%_ if (advisory.isAllowlisted) { _%>
- **Allowlist**：当前漏洞已在 allowlist 中标记
<%_ } _%>
- **依赖关系**：
<%_ if (advisory.pathLines.length === 0) { _%>
  - 未返回具体依赖路径
<%_ } else { _%>
<%_ for (const pathLine of advisory.pathLines) { _%>
  - <%= pathLine %>
<%_ } _%>
<%_ } _%>

---

<%_ } _%>
<%_ } _%>
`;
