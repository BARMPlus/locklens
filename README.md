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

直接使用：

```bash
npx -y locklens --source ./ # 审计当前目录
npx -y locklens --source /path/to/project # 本地仓库审计
npx -y locklens --source https://github.com/BARMPlus/micro-app > audit.md # Github 远程仓库审计
npx -y locklens --output-format json --source https://gitlab.com/gitlab-org/gitlab-vscode-extension.git > audit.json # Gitlab 远程仓库审计
npx -y locklens --source https://github.com/org/repo.git # 支持私有仓库审计，前提是你本机的SSH Key有权限访问该仓库
```

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
| `--source <value>` | 本地目录路径或远程 Git 仓库地址 |
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
    - 本地目录绝对路径，或远程 Git 仓库地址；默认使用当前工作目录
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

## License

Copyright (c) 2026 chenglin

locklens is released under the [MIT License](LICENSE)
