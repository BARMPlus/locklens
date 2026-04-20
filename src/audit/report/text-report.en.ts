import type { SupportedSeverity } from "../types";

// 英文模板配置与中文模板拆开，便于后续单独调整英文术语和报告风格。
export const SEVERITY_LABELS_EN: Record<SupportedSeverity, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
  info: "Info",
};

// 英文报告与中文报告共享同一份数据语义，只在文案和语言风格上做切换。
export const textReportTemplateEn = String.raw`# \`<%= targetName %>\` Audit Report

## Audit Overview

- Audit Source: <%= runtime.source %>
- lockFile: <%= runtime.lockfileName %>

---

## Risk Breakdown

<%_ for (const group of severityGroups) { _%>
- **<%= group.label %>**: **<%= group.count %>**
<%_ } _%>
- **Total Vulnerabilities**: **<%= total %>**

---

## Vulnerability Details

> The minimum displayed vulnerability level is <%= minimumDisplayedSeverityLabel %>. The following report shows <%= displayedSeverityLabels %> issues, with **<%= filteredTotal %>** issues in total.

<% if (advisories.length === 0) { %>
> No issues matched the current threshold.
<% } %>
<%_ for (const group of advisoryGroups) { _%>
### <%= group.label %>

Count: **<%= group.items.length %>**

<%_ for (const advisory of group.items) { _%>
#### <%= advisory.moduleHeading %>

- **Title**: <%= advisory.titleLine %>
- **Advisory ID**: <%= advisory.id %>
- **Severity**: <%= advisory.severityLabel %>
- **Reference**: <%= advisory.url %>
<%_ if (advisory.isAllowlisted) { _%>
- **Allowlist**: This advisory is marked in the allowlist
<%_ } _%>
- **Dependency Paths**:
<%_ if (advisory.pathLines.length === 0) { _%>
  - No dependency path was returned
<%_ } else { _%>
<%_ for (const pathLine of advisory.pathLines) { _%>
  - <%= pathLine %>
<%_ } _%>
<%_ } _%>

---

<%_ } _%>
<%_ } _%>
`;
