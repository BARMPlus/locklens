import { runPackageAudit } from '../audit'
import {
  writeManualAuditResult,
} from './utils/manual-test-utils'

async function main() {
  // 这个文件是“远程仓库手动联调入口”，不是自动化单测。
  // 第一版默认使用公开仓库，目的是优先验证远程 Git 工作区方案本身是否稳定。
  const source = 'https://gitlab.com/gitlab-org/gitlab-vscode-extension' // gitLab 公开仓库
  // const source = 'https://github.com/BARMPlus/micro-app' // gitHub 公开仓库
  // const source = 'https://github.com/BARMPlus/quick-webpack-web' // gitHub 私有仓库（HTTPS 方式）
  // const source = 'git@github.com:BARMPlus/quick-webpack-web.git' // gitHub 私有仓库（SSH 方式）
  // const source = 'https://gitee.com/BluesYoung-web/admin-vue3-element3-vite2' // gitee 公开仓库（HTTPS 方式，白名单平台会保留原协议）
  // const source = 'git@gitee.com:BluesYoung-web/admin-vue3-element3-vite2.git' // gitee 公开仓库（SSH 方式，白名单平台会保留原协议）
  // const source = 'https://git.dian.so/devops/dna-frontend.git' // 内网仓库
  // const source = 'git@git.dian.so:devops/dna-frontend.git' // 内网仓库（SSH 方式）


  const result = await runPackageAudit({
    source,
    // threshold: 'moderate',
    // outputFormat: 'json',
    // outputFormatLanguage: 'en',
  })
  const outputFilePath = await writeManualAuditResult(
    result,
    'audit-remote-manual-result',
    {
      outputDirectory: process.cwd(),
    }
  )

  console.log('[audit-remote-manual-test] 结果写入成功')
  console.log(`[audit-remote-manual-test] 输出文件: ${outputFilePath}`)
}

main().catch((error) => {
  throw error
})
