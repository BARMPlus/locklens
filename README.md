# locklens

`locklens` is a package lockfile auditing tool that works in two modes:

- MCP server mode
- CLI / `npx` mode

It audits npm, Yarn, and pnpm projects with a unified output structure so the
same core capability can be reused in local tools, MCP clients, and command
line workflows.

## Features

- Supports local project directories
- Supports remote Git repositories
- Audits `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, and `pnpm-lock.yaml`
- Works as both an MCP server and a direct CLI
- Normalizes advisory output for easier consumption

## CLI Usage

Run directly with `npx`:

```bash
npx locklens --source /path/to/project --threshold moderate
```

Or after installation:

```bash
locklens --source /path/to/project --threshold moderate
```

Common flags:

- `--source`
- `--threshold`
- `--registry`
- `--skip-dev`
- `--retry-count`
- `--help`
- `--version`

## MCP Usage

Run the built entry without CLI flags to start the MCP stdio server:

```bash
node build/client.js
```

## License

MIT
