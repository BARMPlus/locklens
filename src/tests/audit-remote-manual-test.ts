import { runPackageAudit } from '../audit'
import {
  writeManualAuditResult,
} from './utils/manual-test-utils'

async function main() {
  // 这个文件是“远程仓库手动联调入口”，不是自动化单测。
  // 第一版默认使用公开仓库，目的是优先验证远程 Git 工作区方案本身是否稳定。
  // const source = 'https://gitlab.com/gitlab-org/gitlab-vscode-extension.git' // gitLab 公开仓库
  // const source = 'https://github.com/openai/openai-quickstart-node.git' // gitHub 公开仓库
  // const source = 'https://github.com/BARMPlus/quick-webpack-web' // gitHub 私有仓库（HTTPS 方式）
  // const source = 'git@github.com:BARMPlus/quick-webpack-web.git' // gitHub 私有仓库（SSH 方式）
  const source = 'https://git.dian.so/devops/dna-frontend.git' // 内网仓库
  // const source = 'git@git.dian.so:devops/dna-frontend.git' // 内网仓库（SSH 方式）
  

  const result = await runPackageAudit({
    source,
    threshold: 'moderate',
  })
  const outputFilePath = await writeManualAuditResult(
    result,
    'audit-remote-manual-result'
  )

  console.log('[audit-remote-manual-test] 结果写入成功')
  console.log(`[audit-remote-manual-test] 审计来源: ${result.runtime.source}`)
  console.log(`[audit-remote-manual-test] 临时目录: ${result.runtime.directory}`)
  console.log(`[audit-remote-manual-test] 输出文件: ${outputFilePath}`)
}

main().catch((error) => {
  throw error
})
