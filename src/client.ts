#!/usr/bin/env node
import { createRequire } from 'node:module'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import { AuditError } from './audit'
import { runPackageAudit } from './audit'
import {
  buildCliHelpText,
  CliArgumentError,
  hasCliInvocation,
  parseCliArgs,
} from './cli/args'
import { runCliAudit, writeCliError } from './cli/run-cli'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json') as {
  name: string
  version: string
}

function createAuditServer() {
  const server = new McpServer({
    name: packageJson.name,
    version: packageJson.version,
  })

  server.registerTool(
    'package_audit',
    {
      description: 'Audit a local project or remote Git repository lockfile and return normalized package vulnerability results.',
      inputSchema: {
        source: z.string().optional().describe('Local directory path or remote Git repository URL'),
        threshold: z.enum(['low', 'moderate', 'high', 'critical']).optional().describe('Minimum threshold that controls the returned advisories list'),
        registry: z.string().optional().describe('Custom registry URL used during audit execution'),
        skipDev: z.boolean().optional().describe('Whether to skip dev dependencies during audit'),
        retryCount: z.number().int().min(0).optional().describe('Retry count passed to the audit executor'),
        outputFormat: z.enum(['json', 'text']).optional().describe('Response format. Defaults to text.'),
        // 语言参数和输出格式拆开定义，避免把“格式”和“语言”混进一个字段里。
        outputFormatLanguage: z.enum(['zh', 'en']).optional().describe('Text report language. Defaults to zh.'),
      },
    },
    async ({ source, threshold, registry, skipDev, retryCount, outputFormat, outputFormatLanguage }) => {
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
    }
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
