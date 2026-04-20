import type { AllowlistRecord, Summary as AuditCiSummary } from "audit-ci";

import {
  AUDIT_OUTPUT_FORMATS,
  AUDIT_OUTPUT_FORMAT_LANGUAGES,
  DEFAULT_AUDIT_THRESHOLD,
  DEFAULT_OUTPUT_FORMAT_LANGUAGE,
  DEFAULT_REPORT_TYPE,
  LOCKFILE_PRIORITY,
} from "./constants";

export type LockfileName = (typeof LOCKFILE_PRIORITY)[number];
export type PackageManager = "npm" | "yarn" | "pnpm";
export type AuditThreshold = "low" | "moderate" | "high" | "critical";
export type AuditSourceKind = "local" | "remote";
export type AuditReportType = typeof DEFAULT_REPORT_TYPE;
export type AuditOutputFormat =
  | (typeof AUDIT_OUTPUT_FORMATS)[number];
export type AuditOutputFormatLanguage =
  | typeof DEFAULT_OUTPUT_FORMAT_LANGUAGE
  | (typeof AUDIT_OUTPUT_FORMAT_LANGUAGES)[number];
export type SupportedSeverity =
  | "info"
  | "low"
  | "moderate"
  | "high"
  | "critical";
export type RemoteConnectivityProtocol = "https" | "ssh";

export interface LockfileDetectionResult {
  directory: string;
  packageManager: PackageManager;
  lockfileName: LockfileName;
  lockfilePath: string;
  detectedLockFiles: LockfileName[];
}

export interface PackageAuditOptions {
  source: string;
  threshold?: AuditThreshold;
  allowlist?: AllowlistRecord[];
  skipDev?: boolean;
  registry?: string;
  retryCount?: number;
  passEnoAudit?: boolean;
  extraArgs?: string[];
  outputFormat?: AuditOutputFormat;
  outputFormatLanguage?: AuditOutputFormatLanguage;
}

export interface PackageAuditRuntime {
  source: string;
  sourceType: AuditSourceKind;
  repositoryUrl: string | null;
  resolvedRef: string | null;
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

export interface ResolvedLocalAuditSource {
  kind: "local";
  inputSource: string;
  localDirectory: string;
}

export interface ResolvedRemoteAuditSource {
  kind: "remote";
  inputSource: string;
  repositoryUrl: string;
}

export type ResolvedAuditSource =
  | ResolvedLocalAuditSource
  | ResolvedRemoteAuditSource;

export interface PreparedAuditWorkspace {
  source: string;
  sourceType: AuditSourceKind;
  directory: string;
  repositoryUrl: string | null;
  resolvedRef: string | null;
  cleanup: () => Promise<void>;
}

export interface RemoteConnectivityTarget {
  protocol: RemoteConnectivityProtocol;
  hostname: string;
  port: number;
  repositoryUrl: string;
}

export interface NormalizerContext {
  packageManager: PackageManager;
  auditSummary: AuditCiSummary;
  auditPayload: unknown | null;
}

export type DefaultAuditThreshold = typeof DEFAULT_AUDIT_THRESHOLD;
