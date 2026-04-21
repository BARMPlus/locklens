# locklens

`locklens` 是一个基于 `audit-ci` 的 lockfile 审计工具，支持两种运行模式：

- CLI / `npx`
- MCP Server（`stdio`）

它可以审计本地项目目录或远程 Git 仓库，并支持 `npm`、`yarn`、`pnpm` 的 lockfile。

---

## 特性

- 支持本地项目目录审计
- 支持远程 Git 仓库审计
- 支持 `package-lock.json`、`yarn.lock`、`pnpm-lock.yaml`
- 支持中文、英文文本报告
- 支持显式切换为 JSON 输出

---

## 安装与环境

- `node >= 18`

本地仓库、线上仓库审计：

```bash
# 本地相对目录审计
npx -y locklens --source ./
# 本地绝对目录审计
npx -y locklens --source /path/to/project 
# Github 远程仓库审计
npx -y locklens --source https://github.com/BARMPlus/micro-app > audit.md
# Gitlab 远程仓库审计
npx -y locklens --output-format json --source https://gitlab.com/gitlab-org/gitlab-vscode-extension.git > audit.json 
```

私有仓库审计：

```bash
# 对于 GitHub、GitLab、Gitee 的 HTTPS 地址，locklens 会先尝试通过 ssh -T 判断本机 SSH Key 是否可用于该 Git 服务器；
# 如果可用，会自动切换为 SSH 方式执行。其他私有 Git 服务器仍建议直接依赖本机已有权限的 SSH Key。
npx -y locklens --source https://git.company.local/group/repo.git
# 适合 CI 场景，仅支持 私有部署的 GitLab 服务器应用审计，设置 Personal access tokens 权限访问该仓库
LOCKLENS_GITLAB_PRIVATE_TOKEN=your-token npx -y locklens --source https://git.company.local/group/repo.git 
````



---

## CLI 使用方法

### 常见示例

输出英文文本报告：

```bash
npx -y locklens --source /path/to/project --output-format-language en
```

输出 JSON：

```bash
npx -y locklens --source /path/to/project --output-format json
```

指定阈值为高危：

```bash
npx -y locklens --source /path/to/project --threshold high
```

跳过 devDependencies：

```bash
npx -y locklens --source /path/to/project --skip-dev
```

### CLI 参数

| 参数 | 说明 |
| --- | --- |
| `--source <value>` | 必填。本地目录路径或远程 Git 仓库地址 |
| `--threshold <value>` | 漏洞过滤阈值，可选：`low`、`moderate`、`high`、`critical`，默认：`low` |
| `--registry <url>` | 自定义 npm registry，默认：`https://registry.npmjs.org/` |
| `--skip-dev` | 跳过 dev dependencies |
| `--retry-count <number>` | 审计执行重试次数 |
| `--output-format <value>` | 输出格式，可选：`json`、`text`，默认：`text` |
| `--output-format-language <value>` | 文本报告语言，可选：`zh`、`en`，默认：`zh` |
| `--help` / `-h` | 显示帮助 |
| `--version` / `-v` | 显示版本号 |

---

## MCP 使用方法

`locklens` 支持通过 `stdio` 方式作为 MCP Server 接入，通过将以下配置添加到mcp服务器配置中。

Windows 平台：

```json
{
  "mcpServers": {
    "locklens": {
      "command": "cmd",
      "args": ["/c", "npx", "--yes", "locklens"]
    }
  }
}
```

其他平台：

```json
{
  "mcpServers": {
    "locklens": {
      "command": "npx",
      "args": ["--yes", "locklens"]
    }
  }
}
```

### Tools

### `package_audit`

审计指定项目目录或远程 Git 仓库的 lockfile，并返回统一格式的漏洞结果。

**参数：**
- `source`
    - 必填。本地目录绝对路径，或远程 Git 仓库地址
- `threshold`
    - 漏洞过滤阈值，可选：`low`、`moderate`、`high`、`critical`；默认：`low`
- `registry`
    - 自定义 npm registry 地址；默认：`https://registry.npmjs.org/`
- `skipDev`
    - 是否跳过 dev dependencies
- `retryCount`
    - 审计执行重试次数
- `outputFormat`
    - 输出格式，可选：`text`、`json`；默认：`text`
- `outputFormatLanguage`
    - 文本报告语言，可选：`zh`、`en`；默认：`zh`

---

## Skill

如果你的客户端支持 Skill，也可以直接使用 `dependency-audit`，不需要先接入 MCP。

当前仓库内的 Skill 目录位于：

```text
dependency-audit/
```

默认会带上 `--skip-dev`，优先只带出线上风险；如果你希望带出开发和线上所有依赖风险，可以明确说明取消 `--skip-dev`。

示例：

```
1. 使用 dependency-audit 审计当前项目的依赖问题
2. https://github.com/BARMPlus/micro-app 审计这个项目的依赖，告知我开发和线上所有的依赖问题
3. 输出 https://github.com/BARMPlus/micro-app 这个项目严重的依赖问题
```


---

## License

Copyright (c) 2026 chenglin

locklens is released under the [MIT License](LICENSE)
