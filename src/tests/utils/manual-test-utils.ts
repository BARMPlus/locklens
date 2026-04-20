import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { PackageAuditResult } from '../../audit/types'

export function createTimestamp() {
  // 所有手动联调输出统一按中国大陆时间命名，避免文件名时间和本地理解不一致。
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  })

  const parts = formatter.formatToParts(new Date())
  const timeParts = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${timeParts.year}-${timeParts.month}-${timeParts.day}T${timeParts.hour}-${timeParts.minute}-${timeParts.second}`
}

export async function writeManualAuditResult(
  result: PackageAuditResult | string,
  filePrefix: string,
  options: {
    outputDirectory: string
    extension?: 'json' | 'md'
  }
) {
  const { outputDirectory } = options
  const extension = options.extension ?? (typeof result === 'string' ? 'md' : 'json')
  const outputFileName = `${filePrefix}-${createTimestamp()}.${extension}`
  const outputFilePath = path.join(outputDirectory, outputFileName)
  const outputContent =
    typeof result === 'string' ? `${result}\n` : `${JSON.stringify(result, null, 2)}\n`

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputFilePath, outputContent, 'utf8')

  return outputFilePath
}
