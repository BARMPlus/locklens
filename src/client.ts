#!/usr/bin/env node
import { realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import { AuditError } from './audit'
import { runPackageAudit } from './audit'
import { buildCliHelpText, CliArgumentError, hasCliInvocation, parseCliArgs } from './cli/args'
import { runCliAudit, writeCliError } from './cli/run-cli'
import {
  buildPackageAuditGuideMarkdown,
  PACKAGE_AUDIT_GUIDE_RESOURCE_NAME,
  PACKAGE_AUDIT_GUIDE_RESOURCE_URI,
} from './mcp/resources/package-audit-guide'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json') as {
  name: string
  version: string
}

export function createAuditServer() {
  const server = new McpServer({
    name: packageJson.name,
    version: packageJson.version,
  })

  server.registerResource(
    PACKAGE_AUDIT_GUIDE_RESOURCE_NAME,
    PACKAGE_AUDIT_GUIDE_RESOURCE_URI,
    {
      title: 'Locklens Package Audit Guide',
      description:
        'package_audit 的最小使用指南，包含默认值、输入规则、私有仓库接入方式和常见示例。',
      mimeType: 'text/markdown',
    },
    async () => {
      return {
        contents: [
          {
            uri: PACKAGE_AUDIT_GUIDE_RESOURCE_URI,
            mimeType: 'text/markdown',
            text: buildPackageAuditGuideMarkdown(),
          },
        ],
      }
    },
  )

  server.registerTool(
    'package_audit',
    {
      description:
        'Audit a local project or remote Git repository lockfile and return normalized package vulnerability results.',
      inputSchema: {
        source: z.string().describe('Required. Local directory path or remote Git repository URL'),
        threshold: z
          .enum(['low', 'moderate', 'high', 'critical'])
          .optional()
          .describe(
            'Minimum threshold that controls the returned advisories list. Defaults to low.',
          ),
        registry: z
          .string()
          .optional()
          .describe(
            'Custom registry URL used during audit execution. Defaults to https://registry.npmjs.org/.',
          ),
        skipDev: z.boolean().optional().describe('Whether to skip dev dependencies during audit'),
        retryCount: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe('Retry count passed to the audit executor'),
        outputFormat: z
          .enum(['json', 'text'])
          .optional()
          .describe('Response format. Defaults to text.'),
        // 语言参数和输出格式拆开定义，避免把“格式”和“语言”混进一个字段里。
        outputFormatLanguage: z
          .enum(['zh', 'en'])
          .optional()
          .describe('Text report language. Defaults to zh.'),
      },
    },
    async ({
      source,
      threshold,
      registry,
      skipDev,
      retryCount,
      outputFormat,
      outputFormatLanguage,
    }) => {
      try {
        const result = await runPackageAudit({
          source,
          threshold,
          registry,
          skipDev,
          retryCount,
          outputFormat,
          outputFormatLanguage,
        })

        if (typeof result === 'string') {
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: result as unknown as Record<string, unknown>,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        return {
          content: [
            {
              type: 'text',
              text: message,
            },
          ],
          isError: true,
        }
      }
    },
  )

  return server
}

async function runMcpServer() {
  const server = createAuditServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

async function main() {
  const args = process.argv.slice(2)

  if (hasCliInvocation(args)) {
    try {
      const parsed = parseCliArgs(args)
      switch (parsed.mode) {
        case 'help':
          process.stdout.write(`${buildCliHelpText(packageJson.name)}\n`)
          return
        case 'version':
          process.stdout.write(`${packageJson.version}\n`)
          return
        case 'run':
          await runCliAudit(parsed.options)
          return
        case 'mcp':
          await runMcpServer()
          return
      }
    } catch (error) {
      if (error instanceof CliArgumentError) {
        process.stderr.write(`${error.message}\n`)
        process.exitCode = error.exitCode
        return
      }

      process.exitCode = writeCliError(error)
      return
    }
  }

  await runMcpServer()
}

function isExecutedAsEntryModule() {
  if (!process.argv[1]) {
    return false
  }

  try {
    // 这里通过 realpath 比较真实文件路径，而不是直接比较 argv[1] 的文本值。
    // 原因是 `npx locklens`、npm bin shim、软链接等场景下，
    // process.argv[1] 往往不是源码里这个文件的字面路径，
    // 但它最终会解析到同一个真实文件。
    // 这样既能兼容命令行直跑，也能避免测试 import 时误启动 main()。
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isExecutedAsEntryModule()) {
  main().catch((error) => {
    if (error instanceof AuditError) {
      process.stderr.write(`${error.message}\n`)
      process.exitCode = 1
      return
    }

    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`${message}\n`)
    process.exitCode = 1
  })
}
