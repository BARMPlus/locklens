import type { AllowlistRecord, Summary as AuditCiSummary } from "audit-ci";

import type {
  DEFAULT_AUDIT_THRESHOLD,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_REPORT_TYPE,
  LOCKFILE_PRIORITY,
} from "./constants.js";

export type LockfileName = (typeof LOCKFILE_PRIORITY)[number];
export type PackageManager = "npm" | "yarn" | "pnpm";
export type AuditThreshold = "low" | "moderate" | "high" | "critical";
export type AuditReportType = typeof DEFAULT_REPORT_TYPE;
export type AuditOutputFormat = typeof DEFAULT_OUTPUT_FORMAT;
export type SupportedSeverity =
  | "info"
  | "low"
  | "moderate"
  | "high"
  | "critical";

export interface LockfileDetectionResult {
  directory: string;
  packageManager: PackageManager;
  lockfileName: LockfileName;
  lockfilePath: string;
  detectedLockFiles: LockfileName[];
}

export interface PackageAuditOptions {
  directory?: string;
  threshold?: AuditThreshold;
  allowlist?: AllowlistRecord[];
  skipDev?: boolean;
  registry?: string;
  retryCount?: number;
  passEnoAudit?: boolean;
  extraArgs?: string[];
}

export interface PackageAuditRuntime {
  directory: string;
  packageManager: PackageManager;
  lockfileName: LockfileName;
  lockfilePath: string;
  detectedLockFiles: LockfileName[];
  normalized: true;
}

export interface VulnerabilityCounts {
  info: number | null;
  low: number | null;
  moderate: number | null;
  high: number | null;
  critical: number | null;
  total: number | null;
  filteredTotal: number | null;
}

export interface PackageAuditMetadata {
  vulnerabilities: VulnerabilityCounts;
  thresholdSeverities: AuditThreshold[];
  dependencies: number | null;
  devDependencies: number | null;
  optionalDependencies: number | null;
  totalDependencies: number | null;
}

export interface PackageAuditAdvisory {
  id: string;
  severity: SupportedSeverity | null;
  moduleName: string | null;
  title: string | null;
  url: string;
  paths: string[];
  isAllowlisted: boolean;
}

export interface PackageAuditResult {
  runtime: PackageAuditRuntime;
  metadata: PackageAuditMetadata;
  advisories: PackageAuditAdvisory[];
}

export interface AuditCiAdapterInput {
  detection: LockfileDetectionResult;
  threshold: AuditThreshold;
  allowlist: AllowlistRecord[];
  skipDev: boolean;
  registry?: string;
  retryCount?: number;
  passEnoAudit?: boolean;
  extraArgs?: string[];
}

export interface AuditCiAdapterResult {
  auditSummary: AuditCiSummary;
  auditPayload: unknown | null;
}

export interface NormalizerContext {
  packageManager: PackageManager;
  auditSummary: AuditCiSummary;
  auditPayload: unknown | null;
}

export type DefaultAuditThreshold = typeof DEFAULT_AUDIT_THRESHOLD;
