import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const DISABLED_ASKPASS_PROGRAM = "/usr/bin/false";
const DEFAULT_SSH_TRANSPORT_PROBE_TIMEOUT_MS = 5_000;

type SshTransportProbeStatus = "success" | "failure" | "unknown";

interface SshTransportProbeExecutionResult {
  stdout: string;
  stderr: string;
  errorCode?: string | null;
  timedOut?: boolean;
}

function normalizeProbeOutput(stdout: string, stderr: string) {
  return [stdout, stderr]
    .join("\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .toLowerCase();
}

export function resolveSshTransportProbeStatus(
  result: SshTransportProbeExecutionResult
): SshTransportProbeStatus {
  const normalizedOutput = normalizeProbeOutput(result.stdout, result.stderr);

  // 这类平台通常不会给 shell，但会明确告诉你“认证成功”或“欢迎信息”，
  // 所以这里把“已认证但无 shell”也视为 SSH 可用。
  const successPatterns = [
    "successfully authenticated",
    "welcome to gitlab",
    "welcome to gitee",
    "shell access is disabled",
    "shell is not enabled",
    "does not provide shell access",
  ];
  const failurePatterns = [
    "permission denied",
    "publickey",
    "could not resolve hostname",
    "no such file or directory",
    "connection timed out",
    "operation timed out",
    "connection refused",
    "host key verification failed",
  ];

  if (result.timedOut || result.errorCode === "ENOENT") {
    return "failure";
  }

  if (successPatterns.some((pattern) => normalizedOutput.includes(pattern))) {
    return "success";
  }

  if (failurePatterns.some((pattern) => normalizedOutput.includes(pattern))) {
    return "failure";
  }

  return "unknown";
}

function createNonInteractiveSshProbeEnv() {
  return {
    ...process.env,
    // 禁止终端或图形界面向用户索取用户名密码。
    GIT_TERMINAL_PROMPT: "0",
    SSH_ASKPASS: DISABLED_ASKPASS_PROGRAM,
    GIT_ASKPASS: DISABLED_ASKPASS_PROGRAM,
  };
}

export async function probeSshTransportAvailable(
  hostname: string,
  timeoutMs = DEFAULT_SSH_TRANSPORT_PROBE_TIMEOUT_MS
) {
  try {
    const result = await execFileAsync(
      "ssh",
      [
        "-T",
        "-oBatchMode=yes",
        "-oStrictHostKeyChecking=accept-new",
        "-oPreferredAuthentications=publickey",
        `git@${hostname}`,
      ],
      {
        timeout: timeoutMs,
        env: createNonInteractiveSshProbeEnv(),
      }
    );

    return (
      resolveSshTransportProbeStatus({
        stdout: result.stdout,
        stderr: result.stderr,
      }) === "success"
    );
  } catch (error) {
    const stdout =
      typeof error === "object" &&
      error !== null &&
      "stdout" in error &&
      typeof error.stdout === "string"
        ? error.stdout
        : "";
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
        ? error.stderr
        : "";
    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : null;
    const timedOut =
      typeof error === "object" &&
      error !== null &&
      "killed" in error &&
      error.killed === true;

    return (
      resolveSshTransportProbeStatus({
        stdout,
        stderr,
        errorCode,
        timedOut,
      }) === "success"
    );
  }
}
