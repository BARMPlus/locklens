export const LOCKFILE_PRIORITY = [
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
] as const;

export const DEFAULT_AUDIT_THRESHOLD = "moderate" as const;
export const DEFAULT_REPORT_TYPE = "important" as const;
export const DEFAULT_OUTPUT_FORMAT = "json" as const;

export const EMPTY_VULNERABILITIES = {
  info: null,
  low: null,
  moderate: null,
  high: null,
  critical: null,
} as const;

