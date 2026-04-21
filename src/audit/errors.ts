export class AuditError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = new.target.name
    this.code = code
  }
}

export class LockfileNotFoundError extends AuditError {
  constructor(directory: string) {
    super(
      `No supported lockfile was found in "${directory}". Expected one of package-lock.json, npm-shrinkwrap.json, yarn.lock, or pnpm-lock.yaml.`,
      'LOCKFILE_NOT_FOUND',
    )
  }
}

export class AuditExecutionError extends AuditError {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message, 'AUDIT_EXECUTION_FAILED')
    this.cause = cause
  }
}

function normalizeGitOutput(output: string) {
  const cleanedLines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    // `Cloning into ...` 只是 Git 的过程提示，对定位问题帮助不大，作为最终报错可以去掉。
    .filter((line) => !line.startsWith('Cloning into '))

  return cleanedLines.join('\n')
}

export class InvalidAuditSourceError extends AuditError {
  constructor(source: string) {
    super(
      `The audit source "${source}" is not a valid local directory or supported Git repository address.`,
      'INVALID_AUDIT_SOURCE',
    )
  }
}

function normalizeRemoteConnectivityReason(cause: unknown, timeoutMs: number) {
  const seconds = Math.ceil(timeoutMs / 1000)

  if (typeof cause === 'object' && cause !== null) {
    const errorCode = 'code' in cause && typeof cause.code === 'string' ? cause.code : null

    switch (errorCode) {
      case 'ETIMEDOUT':
        return `TCP connection timed out after ${seconds}s (ETIMEDOUT).`
      case 'ECONNREFUSED':
        return 'The target host refused the TCP connection (ECONNREFUSED).'
      case 'ENOTFOUND':
        return 'The target host could not be resolved by DNS (ENOTFOUND).'
      case 'EAI_AGAIN':
        return 'DNS lookup did not complete successfully (EAI_AGAIN).'
      case 'EHOSTUNREACH':
        return 'The target host is unreachable from the current machine (EHOSTUNREACH).'
      case 'ENETUNREACH':
        return 'The current network cannot reach the target host (ENETUNREACH).'
    }

    if ('message' in cause && typeof cause.message === 'string' && cause.message.trim()) {
      return cause.message.trim()
    }
  }

  return 'No further details were returned by the connectivity probe.'
}

export class RemoteConnectivityError extends AuditError {
  readonly cause?: unknown
  readonly repositoryUrl: string
  readonly hostname: string
  readonly port: number
  readonly timeoutMs: number

  constructor(
    source: string,
    repositoryUrl: string,
    hostname: string,
    port: number,
    timeoutMs: number,
    cause?: unknown,
  ) {
    const seconds = Math.ceil(timeoutMs / 1000)
    const reason = normalizeRemoteConnectivityReason(cause, timeoutMs)

    super(
      `Remote repository connectivity check failed for "${source}". Repository URL: "${repositoryUrl}". Host: ${hostname}. Port: ${port}. Timeout: ${seconds}s. ${reason}`,
      'REMOTE_CONNECTIVITY_FAILED',
    )
    this.cause = cause
    this.repositoryUrl = repositoryUrl
    this.hostname = hostname
    this.port = port
    this.timeoutMs = timeoutMs
  }
}

export class GitLabApiError extends AuditError {
  readonly cause?: unknown
  readonly providerName: string
  readonly envName: string
  readonly repositoryUrl: string

  constructor(
    message: string,
    providerName: string,
    envName: string,
    repositoryUrl: string,
    cause?: unknown,
    code = 'GITLAB_API_FAILED',
  ) {
    super(
      `GitLab API request failed while preparing "${repositoryUrl}" via provider "${providerName}" using ${envName}. ${message}`,
      code,
    )
    this.cause = cause
    this.providerName = providerName
    this.envName = envName
    this.repositoryUrl = repositoryUrl
  }
}

export class GitLabApiAuthenticationError extends GitLabApiError {
  constructor(providerName: string, envName: string, repositoryUrl: string, cause?: unknown) {
    super(
      'Authentication failed or the token does not have access to the target project.',
      providerName,
      envName,
      repositoryUrl,
      cause,
      'GITLAB_API_AUTHENTICATION_FAILED',
    )
  }
}

export class GitLabApiNotFoundError extends GitLabApiError {
  constructor(providerName: string, envName: string, repositoryUrl: string, cause?: unknown) {
    super(
      'The target project or requested file was not found via the GitLab API.',
      providerName,
      envName,
      repositoryUrl,
      cause,
      'GITLAB_API_NOT_FOUND',
    )
  }
}

export class GitLabApiResponseError extends GitLabApiError {
  constructor(
    message: string,
    providerName: string,
    envName: string,
    repositoryUrl: string,
    cause?: unknown,
  ) {
    super(message, providerName, envName, repositoryUrl, cause, 'GITLAB_API_RESPONSE_INVALID')
  }
}

export class GitCommandError extends AuditError {
  readonly cause?: unknown
  readonly command: string
  readonly stderr: string

  constructor(
    source: string,
    args: string[],
    stderr: string,
    cause?: unknown,
    code = 'GIT_COMMAND_FAILED',
  ) {
    const normalizedStderr = normalizeGitOutput(stderr)

    super(
      `Git command failed while preparing "${source}". ${normalizedStderr || 'No further details were returned by git.'}`,
      code,
    )
    this.command = `git ${args.join(' ')}`
    this.stderr = normalizedStderr
    this.cause = cause
  }
}

export class GitCloneError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, 'GIT_CLONE_FAILED')
  }
}

export class GitTimeoutError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, 'GIT_COMMAND_TIMEOUT')
    this.message = `Git command timed out while preparing "${source}". ${this.stderr || 'No further details were returned by git.'}`
  }
}

export class GitSparseCheckoutError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, 'GIT_SPARSE_CHECKOUT_FAILED')
  }
}

export class GitAuthenticationRequiredError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, 'GIT_AUTHENTICATION_REQUIRED')
    this.message = `Git repository "${source}" requires non-interactive access, but the current machine still needs interactive authentication. Please ensure local Git credentials are ready before retrying. ${this.stderr || 'No further details were returned by git.'}`
  }
}

export class PackageManifestNotFoundError extends AuditError {
  constructor(source: string) {
    super(
      `The root package.json file was not found after preparing "${source}". Only root-level package.json is supported.`,
      'PACKAGE_MANIFEST_NOT_FOUND',
    )
  }
}

export class RemoteWorkspaceCleanupError extends AuditError {
  readonly cause?: unknown

  constructor(directory: string, cause?: unknown) {
    super(
      `Failed to clean up temporary remote audit workspace "${directory}".`,
      'REMOTE_WORKSPACE_CLEANUP_FAILED',
    )
    this.cause = cause
  }
}
