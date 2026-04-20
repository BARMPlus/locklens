import { runPackageAudit } from '../audit/service'
import {
  writeManualAuditResult,
} from './utils/manual-test-utils'

async function main() {
  // 这个文件是“本地手动联调入口”，不是自动化单测。
  // 目标是快速验证本地目录审计逻辑，并把结果落盘做人工比对。
  const result = await runPackageAudit({
    // 默认切到更稳定的本地 npm 项目，避免默认指向网络条件更敏感的 Yarn 项目后影响调试体验。
    // 日常联调时只打开一行，避免误解当前到底在测哪个来源。
    // source: '/Users/ccz/Public/个人文稿/bst-company-project/facechat-h5', // npm-lock
    // source: '/Users/ccz/Public/xd-company-project/leviathan', // pnpm-lock
    // source: '/Users/ccz/Public/xd-company-project/yangtze', // yarn.lock 4.0
    source: '/Users/ccz/Public/xd-company-project/dna-frontend', // yarn.lock 1.0
    // source: 'https://gitlab.com/gitlab-org/gitlab-vscode-extension.git', // remote git
    threshold: 'moderate',
  })
  const outputFilePath = await writeManualAuditResult(result, 'audit-manual-result')

  console.log('[audit-manual-test] 结果写入成功')
  console.log(`[audit-manual-test] 审计来源: ${result.runtime.source}`)
  console.log(`[audit-manual-test] 审计目录: ${result.runtime.directory}`)
  console.log(`[audit-manual-test] 输出文件: ${outputFilePath}`)
}

main().catch((error) => {
  throw error
})
