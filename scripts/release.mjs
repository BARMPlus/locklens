#!/usr/bin/env node

import { spawn } from 'node:child_process'
import readline from 'node:readline/promises'
import { exit, stderr, stdin, stdout } from 'node:process'

const RELEASE_TYPES = ['patch', 'minor', 'major']

function isInteractiveTerminal() {
  return Boolean(stdin.isTTY && stdout.isTTY)
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    // 这里继承当前终端输出，保证测试进度与发版过程能直接反馈给使用者。
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: process.env,
    })

    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          signal
            ? `${command} ${args.join(' ')} exited with signal ${signal}.`
            : `${command} ${args.join(' ')} exited with code ${code}.`,
        ),
      )
    })
  })
}

async function promptReleaseType() {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  })

  try {
    stdout.write('请选择本次发版类型：\n')
    stdout.write('1. patch\n')
    stdout.write('2. minor\n')
    stdout.write('3. major\n')

    while (true) {
      const answer = (await rl.question('请输入序号（1/2/3）：')).trim()

      if (answer === '1') {
        return 'patch'
      }

      if (answer === '2') {
        return 'minor'
      }

      if (answer === '3') {
        return 'major'
      }

      stdout.write('无效输入，请输入 1、2 或 3。\n')
    }
  } finally {
    rl.close()
  }
}

async function main() {
  if (!isInteractiveTerminal()) {
    stderr.write('pnpm release 需要在交互式终端中执行，当前环境无法进行版本类型选择。\n')
    exit(1)
  }

  const releaseType = await promptReleaseType()

  if (!RELEASE_TYPES.includes(releaseType)) {
    stderr.write(`不支持的发版类型：${releaseType}\n`)
    exit(1)
  }

  stdout.write(`已选择 ${releaseType} 发版，开始执行 pnpm test:cli...\n`)
  await runCommand('pnpm', ['test:cli'])

  stdout.write(`测试通过，开始执行 standard-version (${releaseType})...\n`)
  await runCommand('pnpm', ['exec', 'standard-version', '--release-as', releaseType])

  stdout.write('发版文件、release commit 和 git tag 已生成。\n')
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  stderr.write(`${message}\n`)
  exit(1)
})
