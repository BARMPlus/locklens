import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { runPackageAudit } from '../audit/service.js'

function createTimestamp() {
  // 测试文件名统一按中国大陆时间生成，避免文件名时间和本地认知相差 8 小时。
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

async function main() {
  // 这个文件是“手动联调入口”，不是自动化单测。
  // 它的目标是让我们在开发 audit 核心模块时，能快速对接真实项目目录做结果比对。

  // 这是一个手动测试入口，目的是让你在开发阶段快速验证 audit 核心逻辑。
  // 这里不再直接把完整 JSON 打到控制台，而是写入被审计项目根目录的文件中，
  // 方便你和 audit-ci 原生命令生成的 audit.json 做逐项对比。
  const result = await runPackageAudit({
    // 下面保留三种包管理器项目路径作为切换模板。
    // 日常联调时只打开一行，避免误解当前到底在测哪个项目。
    // directory: '/Users/ccz/Public/xd-company-project/leviathan', // pnpm-lock
    directory: '/Users/ccz/Public/xd-company-project/yangtze', // yarn.lock 4.0
    // directory: '/Users/ccz/Public/xd-company-project/dna-frontend', // yarn.lock 1.0
    // directory: '/Users/ccz/Public/个人文稿/bst-company-project/facechat-h5', // npm-lock
    threshold: 'moderate',
  })
  const outputDirectory = result.runtime.directory
  const outputFileName = `audit-manual-result-${createTimestamp()}.json`
  const outputFilePath = path.join(outputDirectory, outputFileName)

  // 理论上根目录一定存在，这里保留 mkdir 是为了兼容未来传入尚未创建的目录场景。
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputFilePath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

  // 控制台只保留简短提示，避免终端刷出大段 JSON。
  console.log('[audit-manual-test] 结果写入成功')
  console.log(`[audit-manual-test] 审计目录: ${result.runtime.directory}`)
  console.log(`[audit-manual-test] 输出文件: ${outputFilePath}`)
}

main().catch((error) => {
  console.error('[audit-manual-test] 执行失败:')

  // 这里优先打印完整错误对象，方便排查 audit 核心链路里的真实报错位置。
  if (error instanceof Error) {
    console.error(error.stack ?? error.message)
  } else {
    console.error(String(error))
  }

  process.exitCode = 1
})
