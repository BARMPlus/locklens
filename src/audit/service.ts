import path from "node:path";

import type { AllowlistRecord } from "audit-ci";

import { DEFAULT_AUDIT_THRESHOLD } from "./constants.js";
import { runAuditCiAdapter } from "./audit-ci-adapter.js";
import { detectLockfile } from "./lockfile.js";
import {
  filterAdvisoriesByThreshold,
  normalizeAdvisories,
} from "./normalizers/advisories.js";
import { normalizeMetadata } from "./normalizers/metadata.js";
import type {
  PackageAuditOptions,
  PackageAuditResult,
} from "./types.js";

export async function runPackageAudit(
  options: PackageAuditOptions = {}
): Promise<PackageAuditResult> {
  // 无论调用方传的是相对路径还是绝对路径，都统一成绝对路径处理，
  // 这样后面的 lockfile 检测和 raw 输出都会更稳定。
  const directory = path.resolve(options.directory ?? process.cwd());
  const detection = await detectLockfile(directory);

  // 所有第三方交互都集中在 adapter 层，service 只关心“拿到统一输入，产出统一结果”。
  // 这样外层接 MCP tool 时，可以只依赖这里的稳定返回结构。
  const adapterResult = await runAuditCiAdapter({
    detection,
    threshold: options.threshold ?? DEFAULT_AUDIT_THRESHOLD,
    allowlist: options.allowlist ?? ([] as AllowlistRecord[]),
    skipDev: options.skipDev ?? false,
    registry: options.registry,
    retryCount: options.retryCount,
    passEnoAudit: options.passEnoAudit,
    extraArgs: options.extraArgs,
  });
  const threshold = options.threshold ?? DEFAULT_AUDIT_THRESHOLD;
  const allAdvisories = normalizeAdvisories({
    packageManager: detection.packageManager,
    auditSummary: adapterResult.auditSummary,
    auditPayload: adapterResult.auditPayload,
  });
  const advisories = filterAdvisoriesByThreshold(allAdvisories, threshold);

  // 这里开始进入我们自己的协议层：
  // runtime 负责解释本次审计是如何执行的，
  // metadata / advisories 则是前端真正适合消费的统一结果。
  return {
    runtime: {
      directory: detection.directory,
      packageManager: detection.packageManager,
      lockfileName: detection.lockfileName,
      lockfilePath: detection.lockfilePath,
      detectedLockFiles: detection.detectedLockFiles,
      normalized: true,
    },
    // metadata 的漏洞统计基于“完整去重后的 advisory 列表”重新计算，
    // 不再直接沿用底层工具返回的原始 advisory 条目计数。
    metadata: normalizeMetadata(adapterResult.auditPayload, allAdvisories),
    // advisories 则额外叠加 threshold 过滤，只保留当前阈值及更高等级的漏洞。
    advisories,
  };
}
