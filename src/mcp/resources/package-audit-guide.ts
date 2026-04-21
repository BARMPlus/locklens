export const PACKAGE_AUDIT_GUIDE_RESOURCE_NAME = 'package-audit-guide'
export const PACKAGE_AUDIT_GUIDE_RESOURCE_URI = 'locklens://guides/package-audit'

export function buildPackageAuditGuideMarkdown() {
  // 这份 resource 只保留 MCP 调用最容易踩坑的高价值信息，
  // 不复制 README 的完整内容，避免后续维护两份大文档。
  return [
    '# locklens MCP 使用指南',
    '',
    '`package_audit` 用于审计本地项目目录或远程 Git 仓库的 lockfile，并返回统一格式的漏洞结果。',
    '',
    '## 默认值',
    '',
    '- `threshold`: `low`',
    '- `outputFormat`: `text`',
    '- `outputFormatLanguage`: `zh`',
    '- `registry`: `https://registry.npmjs.org/`',
    '',
    '## 输入规则',
    '',
    '- `source` 为必填参数',
    '- 本地目录示例：`/path/to/project` 或 `./`',
    '- 远程仓库示例：`https://github.com/org/repo.git`',
    '',
    '## 私有仓库接入',
    '',
    '- 如果本机 SSH Key 已具备访问权限，可直接审计私有仓库',
    '- GitLab 自建实例可通过环境变量 `LOCKLENS_GITLAB_PRIVATE_TOKEN` 访问私有仓库',
    '',
    '## 远程仓库行为',
    '',
    '- 远程审计前会先执行 TCP 连通性预检查',
    '- 如果连通性预检查失败，会直接报错，不会进入后续拉取阶段',
    '',
    '## 常见示例',
    '',
    '- 本地目录文本输出：`package_audit({ source: "/path/to/project" })`',
    '- 远程仓库 JSON 输出：`package_audit({ source: "https://gitlab.com/group/repo.git", outputFormat: "json" })`',
    '- GitLab 自建私有仓库：`package_audit({ source: "https://git.company.local/group/repo.git" })`，并设置 `LOCKLENS_GITLAB_PRIVATE_TOKEN`',
  ].join('\n')
}
