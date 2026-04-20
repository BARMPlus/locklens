export type CliThreshold = 'low' | 'moderate' | 'high' | 'critical'

export interface CliRunOptions {
  source?: string
  threshold?: CliThreshold
  registry?: string
  skipDev?: boolean
  retryCount?: number
}

export type ParsedCliArgs =
  | { mode: 'mcp' }
  | { mode: 'help' }
  | { mode: 'version' }
  | { mode: 'run'; options: CliRunOptions }

const VALID_THRESHOLDS: CliThreshold[] = ['low', 'moderate', 'high', 'critical']

export class CliArgumentError extends Error {
  readonly exitCode = 2

  constructor(message: string) {
    super(message)
    this.name = 'CliArgumentError'
  }
}

function readFlagValue(args: string[], index: number, flag: string) {
  const value = args[index + 1]

  if (!value || value.startsWith('--')) {
    throw new CliArgumentError(`Missing value for ${flag}.`)
  }

  return value
}

export function hasCliInvocation(args: string[]) {
  return args.length > 0
}

export function parseCliArgs(args: string[]): ParsedCliArgs {
  if (args.length === 0) {
    return { mode: 'mcp' }
  }

  const options: CliRunOptions = {}

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    switch (argument) {
      case '--help':
      case '-h':
        return { mode: 'help' }
      case '--version':
      case '-v':
        return { mode: 'version' }
      case '--source':
        options.source = readFlagValue(args, index, '--source')
        index += 1
        break
      case '--threshold': {
        const threshold = readFlagValue(args, index, '--threshold')

        if (!VALID_THRESHOLDS.includes(threshold as CliThreshold)) {
          throw new CliArgumentError(
            `Invalid value for --threshold: ${threshold}. Expected one of ${VALID_THRESHOLDS.join(', ')}.`
          )
        }

        options.threshold = threshold as CliThreshold
        index += 1
        break
      }
      case '--registry':
        options.registry = readFlagValue(args, index, '--registry')
        index += 1
        break
      case '--skip-dev':
        options.skipDev = true
        break
      case '--retry-count': {
        const retryCountText = readFlagValue(args, index, '--retry-count')
        const retryCount = Number.parseInt(retryCountText, 10)

        if (!Number.isInteger(retryCount) || retryCount < 0) {
          throw new CliArgumentError(
            `Invalid value for --retry-count: ${retryCountText}. Expected a non-negative integer.`
          )
        }

        options.retryCount = retryCount
        index += 1
        break
      }
      default:
        throw new CliArgumentError(`Unknown argument: ${argument}. Use --help to view supported flags.`)
    }
  }

  return {
    mode: 'run',
    options,
  }
}

export function buildCliHelpText(packageName: string) {
  return [
    `${packageName} supports both MCP stdio mode and direct CLI audit mode.`,
    '',
    'Usage:',
    `  npx ${packageName} --source <value> [flags]`,
    '',
    'Flags:',
    '  --source <value>         Local directory path or remote Git repository URL',
    '  --threshold <value>      low | moderate | high | critical',
    '  --registry <url>         Custom registry URL passed to audit execution',
    '  --skip-dev               Skip dev dependencies during audit',
    '  --retry-count <number>   Retry count for audit execution',
    '  --help, -h               Show this help text',
    '  --version, -v            Show package version',
  ].join('\n')
}
