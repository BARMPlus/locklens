import { AuditError } from '../audit/errors'
import { runPackageAudit } from '../audit/service'
import type { CliRunOptions } from './args'

export async function runCliAudit(options: CliRunOptions) {
  const result = await runPackageAudit({
    source: options.source,
    threshold: options.threshold,
    registry: options.registry,
    skipDev: options.skipDev,
    retryCount: options.retryCount,
  })

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
