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

Quick usage:

```bash
npx locklens --source /path/to/project # Audit a local repository
npx locklens --source https://github.com/openai/openai-quickstart-node.git > audit.md # Audit a remote GitHub repository
npx locklens --output-format json --source https://gitlab.com/gitlab-org/gitlab-vscode-extension.git > audit.json # Audit a remote GitLab repository
npx locklens --source https://github.com/org/repo.git # Private repositories are supported if your local SSH key has access to the repository
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

## License

Copyright (c) 2026 chenglin

locklens is released under the [MIT License](LICENSE)
