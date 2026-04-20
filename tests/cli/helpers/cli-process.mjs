import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

/**
 * 统一封装 CLI 子进程执行逻辑。
 * 这里始终直接调用 build 产物，确保测试覆盖的是发布态行为，而不是 tsx 开发态行为。
 */
export async function runBuiltCli(buildClientPath, args = [], options = {}) {
  try {
    const result = await execFileAsync(process.execPath, [buildClientPath, ...args], {
      cwd: options.cwd,
      env: options.env,
      timeout: options.timeout ?? 30_000,
      maxBuffer: 1024 * 1024,
    })

    return {
      exitCode: 0,
      stdout: result.stdout,
      stderr: result.stderr,
    }
  } catch (error) {
    return {
      exitCode: error.code ?? 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? '',
      signal: error.signal ?? null,
    }
  }
}
