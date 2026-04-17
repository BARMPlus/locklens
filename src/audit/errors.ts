export class AuditError extends Error {
  readonly code: string;

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

