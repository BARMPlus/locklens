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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
