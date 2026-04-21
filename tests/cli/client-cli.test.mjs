import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'

import { runBuiltCli } from './helpers/cli-process.mjs'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')
const buildClientPath = path.join(projectRoot, 'build', 'client.js')
const remoteGitlabSource = 'https://gitlab.com/gitlab-org/gitlab-vscode-extension'

function writeTestProgress(message) {
  process.stderr.write(`[test:cli] ${message}\n`)
}

function parseCliJsonResult(result) {
  assert.equal(result.exitCode, 0, `CLI should succeed, but stderr is: ${result.stderr}`)
  assert.notEqual(result.stdout.trim(), '', 'CLI should return JSON content in stdout.')

  return JSON.parse(result.stdout)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveAuditSourceForTest(source) {
  // 这里通过 tsx 启动一个最小脚本，直接复用源码里的来源解析逻辑，
  // 用于补齐 CLI 集成测试之外的协议归一化行为校验。
  const evalScript = `
    import { resolveAuditSource } from './src/audit/index.ts'

    async function main() {
      const result = await resolveAuditSource(process.argv[1])
      console.log(JSON.stringify(result))
    }

    main().catch((error) => {
      throw error
    })
  `

  const { stdout } = await execFileAsync(
    process.execPath,
    ['./node_modules/tsx/dist/cli.mjs', '--eval', evalScript, source],
    {
      cwd: projectRoot,
    }
  )

  return JSON.parse(stdout)
}

async function resolveRemoteConnectivityTargetForTest(repositoryUrl) {
  // 这里直接复用源码里的远程连通性目标解析逻辑，
  // 保证测试校验的是正式实现，而不是测试侧自己复制一份规则。
  const evalScript = `
    import { resolveRemoteConnectivityTarget } from './src/audit/index.ts'

    const result = resolveRemoteConnectivityTarget(process.argv[1])
    console.log(JSON.stringify(result))
  `

  const { stdout } = await execFileAsync(
    process.execPath,
    ['./node_modules/tsx/dist/cli.mjs', '--eval', evalScript, repositoryUrl],
    {
      cwd: projectRoot,
    }
  )

  return JSON.parse(stdout)
}

async function resolveRemoteWorkspaceProviderPlanForTest(source, envOverrides = {}) {
  // provider 计划是远程编排层的纯决策结果。
  // 这里直接拿正式实现来校验“命中了哪个 provider，以及前置 TCP 校验该探测哪个目标”。
  const evalScript = `
    import { resolveAuditSource, resolveRemoteWorkspaceProviderPlan } from './src/audit/index.ts'

    async function main() {
      const resolvedSource = await resolveAuditSource(process.argv[1])
      if (resolvedSource.kind !== 'remote') {
        throw new Error('Expected a remote source.')
      }

      const plan = resolveRemoteWorkspaceProviderPlan(resolvedSource)
      console.log(JSON.stringify(plan))
    }

    main().catch((error) => {
      throw error
    })
  `

  const { stdout } = await execFileAsync(
    process.execPath,
    ['./node_modules/tsx/dist/cli.mjs', '--eval', evalScript, source],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        ...envOverrides,
      },
    }
  )

  return JSON.parse(stdout)
}

async function readMcpPackageAuditGuideForTest() {
  // 这里直接通过 SDK 的 InMemoryTransport 连接正式 MCP server，
  // 校验 resource 的注册和读取行为，避免测试手写一套协议细节。
  const evalScript = `
    import { Client } from '@modelcontextprotocol/sdk/client/index.js'
    import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
    import { createAuditServer } from './src/client.ts'
    import { PACKAGE_AUDIT_GUIDE_RESOURCE_URI } from './src/mcp/resources/package-audit-guide.ts'

    async function main() {
      const server = createAuditServer()
      const client = new Client({
        name: 'locklens-test-client',
        version: '1.0.0',
      })
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

      await Promise.all([
        server.connect(serverTransport),
        client.connect(clientTransport),
      ])

      const listedResources = await client.listResources()
      const guide = listedResources.resources.find((resource) => resource.uri === PACKAGE_AUDIT_GUIDE_RESOURCE_URI)

      if (!guide) {
        throw new Error('package audit guide resource was not found')
      }

      const readResult = await client.readResource({
        uri: PACKAGE_AUDIT_GUIDE_RESOURCE_URI,
      })

      await Promise.all([
        client.close(),
        server.close(),
      ])

      console.log(JSON.stringify({
        guide,
        contents: readResult.contents,
      }))
    }

    main().catch((error) => {
      throw error
    })
  `

  const { stdout } = await execFileAsync(
    process.execPath,
    ['./node_modules/tsx/dist/cli.mjs', '--eval', evalScript],
    {
      cwd: projectRoot,
    }
  )

  return JSON.parse(stdout)
}

async function createRemoteConnectivityErrorForTest(
  source,
  repositoryUrl,
  hostname,
  port,
  timeoutMs,
  errorCode,
  errorMessage = ''
) {
  // 这里构造一个最小错误对象，专门校验远程连通性错误文案的稳定性。
  const evalScript = `
    import { RemoteConnectivityError } from './src/audit/index.ts'

    const cause = new Error(process.argv[7] || '')
    cause.code = process.argv[6]

    const error = new RemoteConnectivityError(
      process.argv[1],
      process.argv[2],
      process.argv[3],
      Number(process.argv[4]),
      Number(process.argv[5]),
      cause
    )

    console.log(JSON.stringify({
      code: error.code,
      message: error.message,
    }))
  `

  const { stdout } = await execFileAsync(
    process.execPath,
    [
      './node_modules/tsx/dist/cli.mjs',
      '--eval',
      evalScript,
      source,
      repositoryUrl,
      hostname,
      String(port),
      String(timeoutMs),
      errorCode,
      errorMessage,
    ],
    {
      cwd: projectRoot,
    }
  )

  return JSON.parse(stdout)
}

async function runRemoteCliWithRetry(source, threshold = 'moderate') {
  let lastResult = null

  // 远程仓库测试天然依赖外部网络。
  // 这里补一层很薄的重试，只用于降低瞬时 TLS/网络抖动带来的误报。
  for (let attempt = 0; attempt < 3; attempt += 1) {
    writeTestProgress(`开始第 ${attempt + 1} 次远程审计: ${source}`)

    const result = await runBuiltCli(
      buildClientPath,
      ['--source', source, '--threshold', threshold, '--output-format', 'json'],
      {
        cwd: projectRoot,
        timeout: 120_000,
      }
    )

    if (result.exitCode === 0) {
      writeTestProgress(`远程审计成功: ${source}`)
      return result
    }

    writeTestProgress(`远程审计失败，准备重试: ${source}`)
    lastResult = result
  }

  return lastResult
}

function calculateSeverityTotal(vulnerabilities) {
  return (
    (vulnerabilities.info ?? 0) +
    (vulnerabilities.low ?? 0) +
    (vulnerabilities.moderate ?? 0) +
    (vulnerabilities.high ?? 0) +
    (vulnerabilities.critical ?? 0)
  )
}

function assertNormalizedAuditMetrics(payload) {
  assert.equal(payload.runtime.sourceType, 'remote')
  assert.ok(Array.isArray(payload.advisories), 'advisories 应为数组')
  assert.ok(payload.metadata?.vulnerabilities, 'metadata.vulnerabilities 应存在')

  const { vulnerabilities } = payload.metadata
  const severityTotal = calculateSeverityTotal(vulnerabilities)

  assert.equal(
    vulnerabilities.total,
    severityTotal,
    'metadata.vulnerabilities.total 应等于各级别漏洞数量之和'
  )

  assert.equal(
    vulnerabilities.filteredTotal,
    payload.advisories.length,
    'metadata.vulnerabilities.filteredTotal 应与 advisories 长度一致'
  )
}

function buildDisplayedSeverityLabels(payload) {
  const severityLabels = {
    low: '低危',
    moderate: '中危',
    high: '高危',
    critical: '严重',
  }

  return payload.metadata.thresholdSeverities.map((severity) => severityLabels[severity]).join('、')
}

function buildDisplayedSeverityLabelsEn(payload) {
  const severityLabels = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    critical: 'Critical',
  }

  return payload.metadata.thresholdSeverities.map((severity) => severityLabels[severity]).join(', ')
}

function buildMinimumDisplayedSeverityLabel(payload) {
  const severityLabels = {
    low: '低危',
    moderate: '中危',
    high: '高危',
    critical: '严重',
  }

  const minimumSeverity = payload.metadata.thresholdSeverities[0]
  return minimumSeverity ? severityLabels[minimumSeverity] : '无'
}

function buildMinimumDisplayedSeverityLabelEn(payload) {
  const severityLabels = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    critical: 'Critical',
  }

  const minimumSeverity = payload.metadata.thresholdSeverities[0]
  return minimumSeverity ? severityLabels[minimumSeverity] : 'None'
}

function assertTextReportMatchesPayload(reportText, payload) {
  const { vulnerabilities } = payload.metadata

  assert.match(reportText, new RegExp(`审计来源：${escapeRegExp(payload.runtime.source)}`))
  assert.match(
    reportText,
    new RegExp(`- lockFile：${escapeRegExp(payload.runtime.lockfileName)}`)
  )
  assert.match(
    reportText,
    new RegExp(`- \\*\\*风险漏洞总数\\*\\*：\\*\\*${vulnerabilities.total ?? 0}\\*\\*`)
  )

  const severityAssertions = [
    ['严重', vulnerabilities.critical ?? 0],
    ['高危', vulnerabilities.high ?? 0],
    ['中危', vulnerabilities.moderate ?? 0],
    ['低危', vulnerabilities.low ?? 0],
  ]

  for (const [label, count] of severityAssertions) {
    assert.match(
      reportText,
      new RegExp(`- \\*\\*${label}漏洞\\*\\*：共计 \\*\\*${count}\\*\\* 个`)
    )
  }

  assert.doesNotMatch(reportText, /提示漏洞/)

  assert.match(
    reportText,
    new RegExp(
      `当前展示的漏洞最低级别为${escapeRegExp(buildMinimumDisplayedSeverityLabel(payload))}，下面将展示${escapeRegExp(buildDisplayedSeverityLabels(payload))}的错误信息，这些错误总数一共为${payload.metadata.vulnerabilities.filteredTotal ?? 0}个`
    )
  )

  assert.doesNotMatch(reportText, /\*\*依赖关系\*\*：\n\s*\n/)
}

function assertEnglishTextReportMatchesPayload(reportText, payload) {
  const { vulnerabilities } = payload.metadata

  assert.match(reportText, /## Audit Overview/)
  assert.match(reportText, new RegExp(`- Audit Source: ${escapeRegExp(payload.runtime.source)}`))
  assert.match(
    reportText,
    new RegExp(`- lockFile: ${escapeRegExp(payload.runtime.lockfileName)}`)
  )
  assert.match(
    reportText,
    new RegExp(`- \\*\\*Total Vulnerabilities\\*\\*: \\*\\*${vulnerabilities.total ?? 0}\\*\\*`)
  )

  const severityAssertions = [
    ['Critical', vulnerabilities.critical ?? 0],
    ['High', vulnerabilities.high ?? 0],
    ['Moderate', vulnerabilities.moderate ?? 0],
    ['Low', vulnerabilities.low ?? 0],
  ]

  for (const [label, count] of severityAssertions) {
    assert.match(
      reportText,
      new RegExp(`- \\*\\*${label}\\*\\*: \\*\\*${count}\\*\\*`)
    )
  }

  assert.match(
    reportText,
    new RegExp(
      `The minimum displayed vulnerability level is ${escapeRegExp(buildMinimumDisplayedSeverityLabelEn(payload))}\\. The following report shows ${escapeRegExp(buildDisplayedSeverityLabelsEn(payload))} issues, with \\*\\*${payload.metadata.vulnerabilities.filteredTotal ?? 0}\\*\\* issues in total\\.`
    )
  )
}

/**
 * 这一组测试只覆盖正式构建产物的命令行行为。
 * 手动联调用例仍然放在 src/tests 下，两者职责分开，后续维护会更直观。
 */
test('CLI: --help 应返回帮助文本', async () => {
  const result = await runBuiltCli(buildClientPath, ['--help'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 0)
  assert.match(result.stdout, /Usage:/)
  assert.match(result.stdout, /--source <value>/)
  assert.match(result.stdout, /Required/)
  assert.equal(result.stderr, '')
})

test('CLI: 非法 threshold 应返回参数错误退出码', async () => {
  const result = await runBuiltCli(buildClientPath, ['--threshold', 'invalid-level'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 2)
  assert.match(result.stderr, /Invalid value for --threshold/)
})

test('CLI: 非法 output format 应返回参数错误退出码', async () => {
  const result = await runBuiltCli(buildClientPath, ['--output-format', 'markdown'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 2)
  assert.match(result.stderr, /Invalid value for --output-format/)
})

test('CLI: 非法 output format language 应返回参数错误退出码', async () => {
  const result = await runBuiltCli(buildClientPath, ['--output-format-language', 'jp'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 2)
  assert.match(result.stderr, /Invalid value for --output-format-language/)
})

test('CLI: 缺少必填 source 应返回参数错误退出码', async () => {
  const result = await runBuiltCli(buildClientPath, ['--threshold', 'low'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 2)
  assert.match(result.stderr, /Missing required argument: --source/)
})

test('Source Resolver: gitee HTTPS 地址应保留原始协议', async () => {
  const source = 'https://gitee.com/BluesYoung-web/admin-vue3-element3-vite2'
  const resolvedSource = await resolveAuditSourceForTest(source)

  assert.equal(resolvedSource.kind, 'remote')
  assert.equal(resolvedSource.inputSource, source)
  assert.equal(resolvedSource.repositoryUrl, source)
})

test('Source Resolver: 非白名单 HTTP(S) 地址应转换为 SSH', async () => {
  const source = 'https://git.dian.so/devops/dna-frontend'
  const resolvedSource = await resolveAuditSourceForTest(source)

  assert.equal(resolvedSource.kind, 'remote')
  assert.equal(resolvedSource.inputSource, source)
  assert.equal(
    resolvedSource.repositoryUrl,
    'git@git.dian.so:devops/dna-frontend.git'
  )
})

test('Remote Connectivity: HTTPS 地址应解析为 443 端口', async () => {
  const target = await resolveRemoteConnectivityTargetForTest(
    'https://github.com/BARMPlus/micro-app'
  )

  assert.equal(target.protocol, 'https')
  assert.equal(target.hostname, 'github.com')
  assert.equal(target.port, 443)
})

test('Remote Connectivity: SSH URL 应保留显式端口', async () => {
  const target = await resolveRemoteConnectivityTargetForTest(
    'ssh://git@gitlab.com:2222/group/repo.git'
  )

  assert.equal(target.protocol, 'ssh')
  assert.equal(target.hostname, 'gitlab.com')
  assert.equal(target.port, 2222)
})

test('Remote Connectivity: SCP 风格地址应解析为 22 端口', async () => {
  const target = await resolveRemoteConnectivityTargetForTest(
    'git@gitee.com:group/repo.git'
  )

  assert.equal(target.protocol, 'ssh')
  assert.equal(target.hostname, 'gitee.com')
  assert.equal(target.port, 22)
})

test('Remote Connectivity: 非白名单 HTTP(S) 地址归一化后应按 SSH 22 检查', async () => {
  const source = 'https://git.dian.so/devops/dna-frontend'
  const resolvedSource = await resolveAuditSourceForTest(source)
  const target = await resolveRemoteConnectivityTargetForTest(resolvedSource.repositoryUrl)

  assert.equal(target.protocol, 'ssh')
  assert.equal(target.hostname, 'git.dian.so')
  assert.equal(target.port, 22)
})

test('Remote Connectivity: 超时错误文案应包含 5s', async () => {
  const error = await createRemoteConnectivityErrorForTest(
    'https://git.dian.so/devops/dna-frontend',
    'git@git.dian.so:devops/dna-frontend.git',
    'git.dian.so',
    22,
    5_000,
    'ETIMEDOUT'
  )

  assert.equal(error.code, 'REMOTE_CONNECTIVITY_FAILED')
  assert.match(error.message, /Timeout: 5s/)
  assert.match(error.message, /ETIMEDOUT/)
})

test('Remote Provider: gitlab.com + GitLab token 应命中 GitLab provider', async () => {
  const plan = await resolveRemoteWorkspaceProviderPlanForTest(
    'https://gitlab.com/group/repo.git',
    {
      LOCKLENS_GITLAB_TOKEN: 'gitlab-token',
    }
  )

  assert.equal(plan.name, 'gitlab')
  assert.equal(plan.connectivityRepositoryUrl, 'https://gitlab.com/api/v4')
  assert.equal(plan.tokenEnvName, 'LOCKLENS_GITLAB_TOKEN')
})

test('Remote Provider: gitlab.com + 仅 private token 应回退 clone provider', async () => {
  const source = 'https://gitlab.com/group/repo.git'
  const plan = await resolveRemoteWorkspaceProviderPlanForTest(source, {
    LOCKLENS_GITLAB_PRIVATE_TOKEN: 'private-token',
  })

  assert.equal(plan.name, 'git-clone')
  assert.equal(plan.connectivityRepositoryUrl, source)
  assert.equal(plan.tokenEnvName, null)
})

test('Remote Provider: 私有域名 + private token 应命中 self-managed provider', async () => {
  const plan = await resolveRemoteWorkspaceProviderPlanForTest(
    'https://git.dian.so/devops/dna-frontend.git',
    {
      LOCKLENS_GITLAB_PRIVATE_TOKEN: 'private-token',
    }
  )

  assert.equal(plan.name, 'gitlab-self-managed')
  assert.equal(plan.connectivityRepositoryUrl, 'https://git.dian.so/api/v4')
  assert.equal(plan.tokenEnvName, 'LOCKLENS_GITLAB_PRIVATE_TOKEN')
})

test('Remote Provider: 私有域名 + 仅 GitLab token 应回退 clone provider', async () => {
  const plan = await resolveRemoteWorkspaceProviderPlanForTest(
    'https://git.dian.so/devops/dna-frontend.git',
    {
      LOCKLENS_GITLAB_TOKEN: 'gitlab-token',
    }
  )

  assert.equal(plan.name, 'git-clone')
  assert.equal(
    plan.connectivityRepositoryUrl,
    'git@git.dian.so:devops/dna-frontend.git'
  )
  assert.equal(plan.tokenEnvName, null)
})

test('Remote Provider: github 不应命中 GitLab providers', async () => {
  const source = 'https://github.com/BARMPlus/micro-app'
  const plan = await resolveRemoteWorkspaceProviderPlanForTest(source, {
    LOCKLENS_GITLAB_TOKEN: 'gitlab-token',
    LOCKLENS_GITLAB_PRIVATE_TOKEN: 'private-token',
  })

  assert.equal(plan.name, 'git-clone')
  assert.equal(plan.connectivityRepositoryUrl, source)
  assert.equal(plan.tokenEnvName, null)
})

test('CLI: 不存在的 source 应返回简洁错误信息', async () => {
  const result = await runBuiltCli(
    buildClientPath,
    ['--source', '/tmp/locklens-not-exists', '--threshold', 'moderate'],
    {
      cwd: projectRoot,
    }
  )

  assert.equal(result.exitCode, 1)
  assert.match(result.stderr, /not a valid local directory or supported Git repository address/i)
})

test('CLI: 远程连通性预检查失败时应直接报错', async () => {
  const result = await runBuiltCli(
    buildClientPath,
    ['--source', 'ssh://git@127.0.0.1:1/test/repo.git', '--output-format', 'json'],
    {
      cwd: projectRoot,
      timeout: 10_000,
    }
  )

  assert.equal(result.exitCode, 1)
  assert.match(result.stderr, /Remote repository connectivity check failed/i)
  assert.match(result.stderr, /Host: 127\.0\.0\.1/i)
  assert.match(result.stderr, /Port: 1/i)
  assert.doesNotMatch(result.stderr, /requires non-interactive access/i)
})

test('CLI: 默认 output format 应返回中文文本报告', { timeout: 120_000 }, async () => {
  const jsonResult = await runBuiltCli(
    buildClientPath,
    ['--source', projectRoot, '--threshold', 'moderate', '--output-format', 'json'],
    {
      cwd: projectRoot,
      timeout: 120_000,
    }
  )
  const textResult = await runBuiltCli(
    buildClientPath,
    ['--source', projectRoot, '--threshold', 'moderate'],
    {
      cwd: projectRoot,
      timeout: 120_000,
    }
  )

  const payload = parseCliJsonResult(jsonResult)

  assert.equal(textResult.exitCode, 0, `CLI should succeed, but stderr is: ${textResult.stderr}`)
  assert.doesNotMatch(textResult.stdout, /^\s*\{/)
  assertTextReportMatchesPayload(textResult.stdout, payload)
})

test('CLI: 英文文本模板应返回英文报告', { timeout: 120_000 }, async () => {
  const jsonResult = await runBuiltCli(
    buildClientPath,
    ['--source', projectRoot, '--threshold', 'moderate', '--output-format', 'json'],
    {
      cwd: projectRoot,
      timeout: 120_000,
    }
  )
  const textResult = await runBuiltCli(
    buildClientPath,
    ['--source', projectRoot, '--threshold', 'moderate', '--output-format-language', 'en'],
    {
      cwd: projectRoot,
      timeout: 120_000,
    }
  )

  const payload = parseCliJsonResult(jsonResult)

  assert.equal(textResult.exitCode, 0, `CLI should succeed, but stderr is: ${textResult.stderr}`)
  assert.doesNotMatch(textResult.stdout, /^\s*\{/)
  assertEnglishTextReportMatchesPayload(textResult.stdout, payload)
})

test('CLI: GitLab 公开仓库应返回有效审计结果', { timeout: 120_000 }, async () => {
  writeTestProgress('进入 GitLab 公开仓库审计测试')
  const result = await runRemoteCliWithRetry(remoteGitlabSource)

  const payload = parseCliJsonResult(result)
  assert.equal(payload.runtime.source, remoteGitlabSource)
  assertNormalizedAuditMetrics(payload)
})

test('MCP: 不带参数启动时应进入 stdio 模式且短时间内不向 stdout 输出噪音', async () => {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [buildClientPath], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })

    child.on('error', reject)

    // 这里不做完整 MCP 握手，只验证默认启动不会立刻打印杂音。
    setTimeout(() => {
      child.kill('SIGTERM')

      try {
        assert.equal(stdout, '')
        assert.equal(stderr, '')
        resolve()
      } catch (error) {
        reject(error)
      }
    }, 500)
  })
})

test('MCP: 应注册并返回 package_audit 使用指南 resource', async () => {
  const result = await readMcpPackageAuditGuideForTest()
  const [content] = result.contents

  assert.equal(result.guide.name, 'package-audit-guide')
  assert.equal(result.guide.uri, 'locklens://guides/package-audit')
  assert.equal(result.guide.mimeType, 'text/markdown')
  assert.equal(content.uri, 'locklens://guides/package-audit')
  assert.equal(content.mimeType, 'text/markdown')
  assert.match(content.text, /source.*必填参数/)
  assert.match(content.text, /threshold.*low/)
  assert.match(content.text, /outputFormat.*text/)
  assert.match(content.text, /outputFormatLanguage.*zh/)
  assert.match(content.text, /registry.*https:\/\/registry\.npmjs\.org\//)
  assert.match(content.text, /LOCKLENS_GITLAB_PRIVATE_TOKEN/)
})
