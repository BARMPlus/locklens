import type { AllowlistRecord } from 'audit-ci'

import {
  DEFAULT_AUDIT_THRESHOLD,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_OUTPUT_FORMAT_LANGUAGE,
  DEFAULT_AUDIT_REGISTRY,
} from './constants'
import { resolveAuditSource } from './git-source/source-resolver'
import { prepareAuditWorkspace } from './git-workspace/remote-workspace'
import { runAuditCiAdapter } from './audit-ci-adapter'
import { detectLockfile } from './lockfile'
import { filterAdvisoriesByThreshold, normalizeAdvisories } from './normalizers/advisories'
import { normalizeMetadata } from './normalizers/metadata'
import { renderTextReport } from './report/text-report'
import { cleanupExpiredTempArtifacts } from './temp-artifact-maintenance'
import type { PackageAuditOptions, PackageAuditResult } from './types'

export async function runPackageAudit(
  options: PackageAuditOptions & { outputFormat?: 'text' },
): Promise<string>
export async function runPackageAudit(
  options: PackageAuditOptions & { outputFormat: 'json' },
): Promise<PackageAuditResult>
export async function runPackageAudit(
  options: PackageAuditOptions,
): Promise<PackageAuditResult | string>
export async function runPackageAudit(
  options: PackageAuditOptions,
): Promise<PackageAuditResult | string> {
  // 每次审计启动前都先清理一轮过期临时残留，避免异常退出后把旧目录一直堆积在系统临时目录里。
  await cleanupExpiredTempArtifacts()

  const source = options.source
  const resolvedSource = await resolveAuditSource(source)
  const workspace = await prepareAuditWorkspace(resolvedSource)
  let result: PackageAuditResult | null = null
  let executionError: unknown

  try {
    const detection = await detectLockfile(workspace.directory)

    // 真正的审计主链路保持不变。
    // 远程模式只是先准备一个最小本地工作区，然后继续复用现有 lockfile 检测和 adapter。
    const adapterResult = await runAuditCiAdapter({
      detection,
      threshold: options.threshold ?? DEFAULT_AUDIT_THRESHOLD,
      allowlist: options.allowlist ?? ([] as AllowlistRecord[]),
      skipDev: options.skipDev ?? false,
      registry: options.registry ?? DEFAULT_AUDIT_REGISTRY,
      retryCount: options.retryCount,
      passEnoAudit: options.passEnoAudit,
      extraArgs: options.extraArgs,
    })
    const threshold = options.threshold ?? DEFAULT_AUDIT_THRESHOLD
    const allAdvisories = normalizeAdvisories({
      packageManager: detection.packageManager,
      auditSummary: adapterResult.auditSummary,
      auditPayload: adapterResult.auditPayload,
    })
    const advisories = filterAdvisoriesByThreshold(allAdvisories, threshold)

    result = {
      runtime: {
        source: workspace.source,
        sourceType: workspace.sourceType,
        repositoryUrl: workspace.repositoryUrl,
        resolvedRef: workspace.resolvedRef,
        directory: detection.directory,
        packageManager: detection.packageManager,
        lockfileName: detection.lockfileName,
        lockfilePath: detection.lockfilePath,
        detectedLockFiles: detection.detectedLockFiles,
        normalized: true,
      },
      // metadata 的漏洞统计基于“完整去重后的 advisory 列表”重新计算，
      // 不再直接沿用底层工具返回的原始 advisory 条目计数。
      metadata: normalizeMetadata(adapterResult.auditPayload, allAdvisories, threshold),
      // advisories 则额外叠加 threshold 过滤，只保留当前阈值及更高等级的漏洞。
      advisories,
    }
  } catch (error) {
    executionError = error
  }

  try {
    await workspace.cleanup()
  } catch (cleanupError) {
    if (!executionError) {
      throw cleanupError
    }
  }

  if (executionError) {
    throw executionError
  }

  const normalizedResult = result as PackageAuditResult

  const outputFormat = options.outputFormat ?? DEFAULT_OUTPUT_FORMAT

  if (outputFormat === 'text') {
    // 文本输出时再根据语言参数选择中英文模板；json 输出分支会直接返回结构化结果。
    return renderTextReport(
      normalizedResult,
      options.outputFormatLanguage ?? DEFAULT_OUTPUT_FORMAT_LANGUAGE,
    )
  }

  return normalizedResult
}
