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
  result: PackageAuditResult,
  filePrefix: string
) {
  // 远程审计使用的是临时工作区，结束后会被清理，所以结果文件要写到当前工具仓库根目录。
  // 本地审计则继续写到被审计项目目录，便于和 audit-ci 原生命令的输出做对比。
  const outputDirectory =
    result.runtime.sourceType === 'remote' ? process.cwd() : result.runtime.directory
  const outputFileName = `${filePrefix}-${createTimestamp()}.json`
  const outputFilePath = path.join(outputDirectory, outputFileName)

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputFilePath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

  return outputFilePath
}
