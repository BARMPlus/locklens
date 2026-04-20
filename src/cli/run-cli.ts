import { AuditError } from '../audit'
import { runPackageAudit } from '../audit'
import type { ValidatedCliRunOptions } from './args'

export async function runCliAudit(options: ValidatedCliRunOptions) {
  const result = await runPackageAudit({
    source: options.source,
    threshold: options.threshold,
    registry: options.registry,
    skipDev: options.skipDev,
    retryCount: options.retryCount,
    outputFormat: options.outputFormat,
    outputFormatLanguage: options.outputFormatLanguage,
  })

  // 默认输出已经切到 text，这里保留字符串/JSON 双分支以兼容显式 json 调用。
  if (typeof result === 'string') {
    process.stdout.write(`${result}\n`)
    return
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

export function writeCliError(error: unknown) {
  if (error instanceof AuditError) {
    process.stderr.write(`${error.message}\n`)
    return 1
  }

  if (error instanceof Error) {
    process.stderr.write(`${error.message}\n`)
    return 1
  }

  process.stderr.write(`${String(error)}\n`)
  return 1
}
