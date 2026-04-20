export class AuditError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class LockfileNotFoundError extends AuditError {
  constructor(directory: string) {
    super(
      `No supported lockfile was found in "${directory}". Expected one of package-lock.json, npm-shrinkwrap.json, yarn.lock, or pnpm-lock.yaml.`,
      "LOCKFILE_NOT_FOUND"
    );
  }
}

export class AuditExecutionError extends AuditError {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message, "AUDIT_EXECUTION_FAILED");
    this.cause = cause;
  }
}

function normalizeGitOutput(output: string) {
  const cleanedLines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    // `Cloning into ...` 只是 Git 的过程提示，对定位问题帮助不大，作为最终报错可以去掉。
    .filter((line) => !line.startsWith("Cloning into "));

  return cleanedLines.join("\n");
}

export class InvalidAuditSourceError extends AuditError {
  constructor(source: string) {
    super(
      `The audit source "${source}" is not a valid local directory or supported Git repository address.`,
      "INVALID_AUDIT_SOURCE"
    );
  }
}

export class GitCommandError extends AuditError {
  readonly cause?: unknown;
  readonly command: string;
  readonly stderr: string;

  constructor(
    source: string,
    args: string[],
    stderr: string,
    cause?: unknown,
    code = "GIT_COMMAND_FAILED"
  ) {
    const normalizedStderr = normalizeGitOutput(stderr);

    super(
      `Git command failed while preparing "${source}". ${normalizedStderr || "No further details were returned by git."}`,
      code
    );
    this.command = `git ${args.join(" ")}`;
    this.stderr = normalizedStderr;
    this.cause = cause;
  }
}

export class GitCloneError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, "GIT_CLONE_FAILED");
  }
}

export class GitTimeoutError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, "GIT_COMMAND_TIMEOUT");
    this.message = `Git command timed out while preparing "${source}". ${this.stderr || "No further details were returned by git."}`;
  }
}

export class GitSparseCheckoutError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, "GIT_SPARSE_CHECKOUT_FAILED");
  }
}

export class GitAuthenticationRequiredError extends GitCommandError {
  constructor(source: string, args: string[], stderr: string, cause?: unknown) {
    super(source, args, stderr, cause, "GIT_AUTHENTICATION_REQUIRED");
    this.message = `Git repository "${source}" requires non-interactive access, but the current machine still needs interactive authentication. Please ensure local Git credentials are ready before retrying. ${this.stderr || "No further details were returned by git."}`;
  }
}

export class PackageManifestNotFoundError extends AuditError {
  constructor(source: string) {
    super(
      `The root package.json file was not found after preparing "${source}". Only root-level package.json is supported.`,
      "PACKAGE_MANIFEST_NOT_FOUND"
    );
  }
}

export class RemoteWorkspaceCleanupError extends AuditError {
  readonly cause?: unknown;

  constructor(directory: string, cause?: unknown) {
    super(
      `Failed to clean up temporary remote audit workspace "${directory}".`,
      "REMOTE_WORKSPACE_CLEANUP_FAILED"
    );
    this.cause = cause;
  }
}
