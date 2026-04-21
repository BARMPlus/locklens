# locklens

`locklens` is a lockfile auditing tool based on `audit-ci`, with two runtime modes:

- CLI / `npx`
- MCP Server (`stdio`)

It can audit a local project directory or a remote Git repository, and supports lockfiles from `npm`, `yarn`, and `pnpm`.

---

## Features

- Supports local project directory auditing
- Supports remote Git repository auditing
- Supports `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`
- Supports Chinese and English text reports
- Supports explicit JSON output

---

## Installation and Environment

- `node >= 18`

Audit local and remote repositories:

```bash
# Audit a local relative directory
npx -y locklens --source ./
# Audit a local absolute directory
npx -y locklens --source /path/to/project
# Audit a remote GitHub repository
npx -y locklens --source https://github.com/BARMPlus/micro-app > audit.md
# Audit a remote GitLab repository
npx -y locklens --output-format json --source https://gitlab.com/gitlab-org/gitlab-vscode-extension.git > audit.json
```

Audit private repositories:

```bash
# Supports auditing private repositories on GitHub, GitLab, and privately deployed Git servers,
# as long as your local SSH key has permission to access the repository
npx -y locklens --source https://git.company.local/group/repo.git
# Recommended for CI scenarios. Only supports privately deployed GitLab servers.
# Configure a Personal Access Token with permission to access the repository
LOCKLENS_GITLAB_PRIVATE_TOKEN=your-token npx -y locklens --source https://git.company.local/group/repo.git
```

---

## CLI Usage

### Common Examples

Output an English text report:

```bash
npx locklens --source /path/to/project --output-format-language en
```

Output JSON:

```bash
npx locklens --source /path/to/project --output-format json
```

Set threshold to high:

```bash
npx locklens --source /path/to/project --threshold high
```

Skip devDependencies:

```bash
npx locklens --source /path/to/project --skip-dev
```

### CLI Arguments

| Argument | Description |
| --- | --- |
| `--source <value>` | Required. Local directory path or remote Git repository URL |
| `--threshold <value>` | Vulnerability severity threshold. Options: `low`, `moderate`, `high`, `critical`. Default: `low` |
| `--registry <url>` | Custom npm registry. Default: `https://registry.npmjs.org/` |
| `--skip-dev` | Skip dev dependencies |
| `--retry-count <number>` | Retry count for audit execution |
| `--output-format <value>` | Output format. Options: `json`, `text`. Default: `text` |
| `--output-format-language <value>` | Text report language. Options: `zh`, `en`. Default: `zh` |
| `--help` / `-h` | Show help |
| `--version` / `-v` | Show version |

---

## MCP Usage

`locklens` can run as an MCP Server over `stdio`. Add one of the following configurations to your MCP server settings.

On Windows:

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

On other platforms:

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

Audits the lockfile of a target local project directory or remote Git repository and returns vulnerabilities in a normalized format.

**Parameters:**
- `source`
    - Required. Absolute local directory path or remote Git repository URL
- `threshold`
    - Vulnerability severity threshold. Options: `low`, `moderate`, `high`, `critical`; default: `low`
- `registry`
    - Custom npm registry URL; default: `https://registry.npmjs.org/`
- `skipDev`
    - Whether to skip dev dependencies
- `retryCount`
    - Retry count for audit execution
- `outputFormat`
    - Output format. Options: `text`, `json`; default: `text`
- `outputFormatLanguage`
    - Text report language. Options: `zh`, `en`; default: `zh`

---

## Skill

If your client supports Skills, you can use `dependency-audit` directly without setting up MCP.

The Skill directory in this repository is located at:

```text
dependency-audit/
```

By default, the skill uses `--skip-dev` to focus on production-facing risk. If you want both development and production dependency risk, state that clearly so the run can proceed without `--skip-dev`.

Examples:

```text
1. Use dependency-audit to audit dependency issues in the current project
2. Audit dependency issues in https://github.com/BARMPlus/micro-app and tell me all development and production dependency risks
3. Output the critical dependency issues in https://github.com/BARMPlus/micro-app
```


---

## License

Copyright (c) 2026 chenglin

locklens is released under the [MIT License](LICENSE)
