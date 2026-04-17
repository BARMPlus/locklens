import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { runPackageAudit } from '../audit/service.js'

function createTimestamp() {
  return new Date().toISOString().replace(/:/g, '-')
}

async function main() {
  // 这是一个手动测试入口，目的是让你在开发阶段快速验证 audit 核心逻辑。
  // 这里不再直接把完整 JSON 打到控制台，而是写入被审计项目根目录的文件中，
  // 方便你和 audit-ci 原生命令生成的 audit.json 做逐项对比。
  const result = await runPackageAudit({
    // directory: '/Users/ccz/Public/xd-company-project/leviathan', // pnpm-lock
    //  directory: '/Users/ccz/Public/xd-company-project/yangtze', // yarn.lock
    directory: '/Users/ccz/Public/个人文稿/bst-company-project/facechat-h5', // npm-lock
    threshold: 'moderate'
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
  const message = error instanceof Error ? error.message : String(error)

  console.error('[audit-manual-test] 执行失败:')
  console.error(message)
  process.exitCode = 1
})
