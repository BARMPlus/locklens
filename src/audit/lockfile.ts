import { access } from "node:fs/promises";
import path from "node:path";

import { LOCKFILE_PRIORITY } from "./constants";
import { LockfileNotFoundError } from "./errors";
import type {
  LockfileDetectionResult,
  LockfileName,
  PackageManager,
} from "./types";

const PACKAGE_MANAGER_BY_LOCKFILE: Record<LockfileName, PackageManager> = {
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm",
};

async function lockfileExists(directory: string, lockfileName: LockfileName) {
  try {
    await access(path.join(directory, lockfileName));
    return true;
  } catch {
    return false;
  }
}

export async function detectLockfile(
  directory: string
): Promise<LockfileDetectionResult> {
  // 按预设优先级并发检查 lockfile 是否存在。
  // 这样既能保持检测速度，也能确保后续选择逻辑稳定可预测。
  const checks = await Promise.all(
    LOCKFILE_PRIORITY.map(async (lockfileName) => ({
      lockfileName,
      exists: await lockfileExists(directory, lockfileName),
    }))
  );

  // 保留所有扫描到的 lockfile，方便后续对外解释：
  // “为什么最终选中了某一个 lockfile 来执行审计”。
  const detectedLockFiles = checks
    .filter((item) => item.exists)
    .map((item) => item.lockfileName);

  if (detectedLockFiles.length === 0) {
    throw new LockfileNotFoundError(directory);
  }

  const lockfileName = detectedLockFiles[0];

  // 这里直接取排序后的第一个结果，等价于“按优先级自动选择”。
  // 这样调用方不需要再重复实现一遍优先级判断。
  return {
    directory,
    packageManager: PACKAGE_MANAGER_BY_LOCKFILE[lockfileName],
    lockfileName,
    lockfilePath: path.join(directory, lockfileName),
    detectedLockFiles,
  };
}
