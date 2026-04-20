export const LOCKFILE_PRIORITY = [
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
] as const;

export const DEFAULT_AUDIT_THRESHOLD = "low" as const;
export const DEFAULT_REPORT_TYPE = "important" as const;
// 默认输出改为文本报告，只有显式传 json 时才返回结构化结果。
export const DEFAULT_OUTPUT_FORMAT = "text" as const;
export const AUDIT_OUTPUT_FORMATS = ["json", "text"] as const;
// 文本报告默认走中文模板。
export const DEFAULT_OUTPUT_FORMAT_LANGUAGE = "zh" as const;
export const AUDIT_OUTPUT_FORMAT_LANGUAGES = ["zh", "en"] as const;

// 默认 npm 源
export const DEFAULT_AUDIT_REGISTRY =  "https://registry.npmjs.org/" as const;
// 远程仓库 TCP 连通性预检查默认超时时间。
export const DEFAULT_REMOTE_CONNECTIVITY_TIMEOUT_MS = 5_000 as const;

export const EMPTY_VULNERABILITIES = {
  info: null,
  low: null,
  moderate: null,
  high: null,
  critical: null,
} as const;
