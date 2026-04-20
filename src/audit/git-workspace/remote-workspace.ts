import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  PackageManifestNotFoundError,
  RemoteWorkspaceCleanupError,
} from "../errors";
import type {
  PreparedAuditWorkspace,
  ResolvedAuditSource,
  ResolvedRemoteAuditSource,
} from "../types";
import { assertRemoteRepositoryConnectivity } from "../remote-connectivity";
import { runGitCommand } from "./git-command";

const ROOT_AUDIT_FILES = [
  "package.json",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
] as const;

async function ensurePackageManifestExists(
  source: ResolvedRemoteAuditSource,
  directory: string
) {
  try {
    await access(path.join(directory, "package.json"));
  } catch {
    throw new PackageManifestNotFoundError(source.repositoryUrl);
  }
}

async function hasRootPackageManifest(directory: string) {
  try {
    await access(path.join(directory, "package.json"));
    return true;
  } catch {
    return false;
  }
}

async function readResolvedRef(source: ResolvedRemoteAuditSource, directory: string) {
  const result = await runGitCommand(["-C", directory, "branch", "--show-current"], {
    source: source.repositoryUrl,
    step: "read-ref",
  });

  return result.stdout || null;
}

async function cleanupWorkspace(directory: string) {
  try {
    await rm(directory, { recursive: true, force: true });
  } catch (error) {
    throw new RemoteWorkspaceCleanupError(directory, error);
  }
}

export async function prepareAuditWorkspace(
  resolvedSource: ResolvedAuditSource
): Promise<PreparedAuditWorkspace> {
  if (resolvedSource.kind === "local") {
    return {
      source: resolvedSource.inputSource,
      sourceType: "local",
      directory: resolvedSource.localDirectory,
      repositoryUrl: null,
      resolvedRef: null,
      cleanup: async () => {},
    };
  }

  // 这里先做一次轻量 TCP 预检查。
  // 这样在“没连内网 / 端口被拦截 / DNS 不通”这些场景里可以更快失败，
  // 不必先等 Git clone 的 60s 超时。
  await assertRemoteRepositoryConnectivity(
    resolvedSource.inputSource,
    resolvedSource.repositoryUrl
  );

  const workspaceDirectory = await mkdtemp(
    path.join(tmpdir(), "frontend-audit-remote-")
  );

  try {
    // 远程模式不再依赖平台 API，而是统一通过 Git 构造一个最小工作区。
    // repositoryUrl 在来源解析层已经被规整为“实际要执行的仓库地址”。
    // GitHub / GitLab / Gitee 会保留用户原始协议，其他 HTTP(S) 地址会转成 SSH。
    await runGitCommand(
      [
        "clone",
        "--depth",
        "1",
        "--filter=blob:none",
        "--no-checkout",
        resolvedSource.repositoryUrl,
        workspaceDirectory,
      ],
      {
        source: resolvedSource.repositoryUrl,
        step: "clone",
      }
    );

    await runGitCommand(
      ["-C", workspaceDirectory, "sparse-checkout", "init", "--no-cone"],
      {
        source: resolvedSource.repositoryUrl,
        step: "sparse-init",
      }
    );

    await runGitCommand(
      ["-C", workspaceDirectory, "sparse-checkout", "set", ...ROOT_AUDIT_FILES],
      {
        source: resolvedSource.repositoryUrl,
        step: "sparse-set",
      }
    );

    // 不同 Git 版本对 `sparse-checkout set` 后是否立即物化工作区文件的行为不完全一致。
    // 如果关键文件已经出现，就直接复用当前工作区；只有在文件还没落到工作区时才补一次 checkout。
    if (!(await hasRootPackageManifest(workspaceDirectory))) {
      await runGitCommand(["-C", workspaceDirectory, "checkout", "--quiet"], {
        source: resolvedSource.repositoryUrl,
        step: "checkout",
      });
    }

    await ensurePackageManifestExists(resolvedSource, workspaceDirectory);
    const resolvedRef = await readResolvedRef(resolvedSource, workspaceDirectory);

    return {
      source: resolvedSource.inputSource,
      sourceType: "remote",
      directory: workspaceDirectory,
      repositoryUrl: resolvedSource.repositoryUrl,
      resolvedRef,
      cleanup: async () => cleanupWorkspace(workspaceDirectory),
    };
  } catch (error) {
    await rm(workspaceDirectory, { recursive: true, force: true });
    throw error;
  }
}
