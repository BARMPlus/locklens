import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

import { runBuiltCli } from './helpers/cli-process.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')
const buildClientPath = path.join(projectRoot, 'build', 'client.js')
const remoteGithubSource = 'https://github.com/openai/openai-quickstart-node.git'
const remoteGitlabSource = 'https://gitlab.com/gitlab-org/gitlab-vscode-extension.git'

function writeTestProgress(message) {
  process.stderr.write(`[test:cli] ${message}\n`)
}

function parseCliJsonResult(result) {
  assert.equal(result.exitCode, 0, `CLI should succeed, but stderr is: ${result.stderr}`)
  assert.notEqual(result.stdout.trim(), '', 'CLI should return JSON content in stdout.')

  return JSON.parse(result.stdout)
}

async function runRemoteCliWithRetry(source, threshold = 'moderate') {
  let lastResult = null

  // 远程仓库测试天然依赖外部网络。
  // 这里补一层很薄的重试，只用于降低瞬时 TLS/网络抖动带来的误报。
  for (let attempt = 0; attempt < 3; attempt += 1) {
    writeTestProgress(`开始第 ${attempt + 1} 次远程审计: ${source}`)

    const result = await runBuiltCli(
      buildClientPath,
      ['--source', source, '--threshold', threshold],
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
  assert.equal(result.stderr, '')
})

test('CLI: --version 应返回当前包版本', async () => {
  const result = await runBuiltCli(buildClientPath, ['--version'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 0)
  assert.equal(result.stdout.trim(), '1.0.0')
  assert.equal(result.stderr, '')
})

test('CLI: 非法 threshold 应返回参数错误退出码', async () => {
  const result = await runBuiltCli(buildClientPath, ['--threshold', 'invalid-level'], {
    cwd: projectRoot,
  })

  assert.equal(result.exitCode, 2)
  assert.match(result.stderr, /Invalid value for --threshold/)
})

test('CLI: 不存在的 source 应返回简洁错误信息', async () => {
  const result = await runBuiltCli(
    buildClientPath,
    ['--source', '/tmp/frontend-audit-mcp-not-exists', '--threshold', 'moderate'],
    {
      cwd: projectRoot,
    }
  )

  assert.equal(result.exitCode, 1)
  assert.match(result.stderr, /not a valid local directory or supported Git repository address/i)
})

test('CLI: GitHub 公开仓库应返回有效审计结果', { timeout: 120_000 }, async () => {
  writeTestProgress('进入 GitHub 公开仓库审计测试')
  const result = await runRemoteCliWithRetry(remoteGithubSource)

  const payload = parseCliJsonResult(result)
  assert.equal(payload.runtime.source, remoteGithubSource)
  assertNormalizedAuditMetrics(payload)
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
