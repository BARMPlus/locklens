import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  GitAuthenticationRequiredError,
  GitCloneError,
  GitCommandError,
  GitSparseCheckoutError,
  GitTimeoutError,
} from "../errors.js";

const execFileAsync = promisify(execFile);
const DEFAULT_GIT_TIMEOUT_MS = 60_000;
const NON_INTERACTIVE_SSH_COMMAND =
  "ssh -oBatchMode=yes -oStrictHostKeyChecking=accept-new";
const DISABLED_ASKPASS_PROGRAM = "/usr/bin/false";

interface GitCommandOptions {
  source: string;
  step: "clone" | "sparse-init" | "sparse-set" | "checkout" | "read-ref";
  cwd?: string;
}

function isAuthenticationError(stderr: string) {
  const normalizedStderr = stderr.toLowerCase();

  return (
    normalizedStderr.includes("terminal prompts disabled") ||
    normalizedStderr.includes("batchmode") ||
    normalizedStderr.includes("authentication failed") ||
    normalizedStderr.includes("could not read username") ||
    normalizedStderr.includes("could not read password") ||
    normalizedStderr.includes("could not open a connection to your authentication agent") ||
    normalizedStderr.includes("sign_and_send_pubkey") ||
    normalizedStderr.includes("permission denied") ||
    normalizedStderr.includes("enter passphrase") ||
    normalizedStderr.includes("passphrase") ||
    normalizedStderr.includes("publickey") ||
    normalizedStderr.includes("host key verification failed") ||
    normalizedStderr.includes("could not resolve hostname") ||
    normalizedStderr.includes("http basic: access denied") ||
    normalizedStderr.includes("repository not found")
  );
}

function createNonInteractiveGitEnv() {
  return {
    ...process.env,
    // 禁止 Git 在终端里等待用户名/密码输入。
    GIT_TERMINAL_PROMPT: "0",
    // 禁止 Git 通过 askpass 程序拉起图形化认证弹窗。
    GIT_ASKPASS: DISABLED_ASKPASS_PROGRAM,
    // 禁止 SSH 通过 askpass 拉起额外授权窗口。
    SSH_ASKPASS: DISABLED_ASKPASS_PROGRAM,
    // 明确要求 SSH 使用非交互模式，不能无交互访问就直接失败。
    GIT_SSH_COMMAND: NON_INTERACTIVE_SSH_COMMAND,
    // 禁止 Git Credential Manager 进入交互流程。
    GCM_INTERACTIVE: "Never",
  };
}

function buildGitCommandError(
  options: GitCommandOptions,
  args: string[],
  stderr: string,
  cause: unknown
) {
  if (
    typeof cause === "object" &&
    cause !== null &&
    (("killed" in cause && cause.killed === true) ||
      ("signal" in cause && cause.signal === "SIGTERM") ||
      ("message" in cause &&
        typeof cause.message === "string" &&
        cause.message.toLowerCase().includes("timed out")))
  ) {
    return new GitTimeoutError(options.source, args, stderr, cause);
  }

  if (isAuthenticationError(stderr)) {
    return new GitAuthenticationRequiredError(options.source, args, stderr, cause);
  }

  if (options.step === "clone") {
    return new GitCloneError(options.source, args, stderr, cause);
  }

  if (options.step === "sparse-init" || options.step === "sparse-set") {
    return new GitSparseCheckoutError(options.source, args, stderr, cause);
  }

  return new GitCommandError(options.source, args, stderr, cause);
}

export async function runGitCommand(
  args: string[],
  options: GitCommandOptions
) {
  try {
    const result = await execFileAsync("git", args, {
      cwd: options.cwd,
      timeout: DEFAULT_GIT_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
      env: createNonInteractiveGitEnv(),
    });

    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (error) {
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
        ? error.stderr
        : "";
    const stdout =
      typeof error === "object" &&
      error !== null &&
      "stdout" in error &&
      typeof error.stdout === "string"
        ? error.stdout
        : "";

    throw buildGitCommandError(
      options,
      args,
      stderr.trim() || stdout.trim(),
      error
    );
  }
}
