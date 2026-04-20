import { readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  DEFAULT_STALE_TEMP_ARTIFACT_MAX_AGE_MS,
  LOCKLENS_TEMP_ARTIFACT_PREFIX,
} from "./constants";

function isExpiredTempArtifact(mtimeMs: number, nowMs: number) {
  return nowMs - mtimeMs > DEFAULT_STALE_TEMP_ARTIFACT_MAX_AGE_MS;
}

export async function cleanupExpiredTempArtifacts(
  tempDirectory: string = tmpdir(),
  nowMs: number = Date.now()
) {
  let entries: string[];

  try {
    // 这里只扫描系统临时目录的顶层条目，避免递归遍历带来不必要的性能和误删风险。
    entries = await readdir(tempDirectory);
  } catch {
    // 启动前清理只是兜底维护动作，读取临时目录失败时不阻断主流程。
    return;
  }

  const expiredTargets = entries
    .filter((entry) => entry.startsWith(LOCKLENS_TEMP_ARTIFACT_PREFIX))
    .map((entry) => path.join(tempDirectory, entry));

  await Promise.all(
    expiredTargets.map(async (targetPath) => {
      try {
        const targetStats = await stat(targetPath);

        if (!isExpiredTempArtifact(targetStats.mtimeMs, nowMs)) {
          return;
        }

        // 目录和普通文件都统一交给 rm 处理，这样各类临时资源都能走同一套过期清理逻辑。
        await rm(targetPath, {
          recursive: true,
          force: true,
        });
      } catch {
        // 单个残留项清理失败也不影响本次审计，让主流程继续执行。
      }
    })
  );
}
