import { access, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { PackageManifestNotFoundError, RemoteWorkspaceCleanupError } from '../../errors'
import { LOCKLENS_TEMP_ARTIFACT_PREFIX, REMOTE_AUDIT_ROOT_FILES } from '../../constants'
import type { PreparedAuditWorkspace, ResolvedRemoteAuditSource } from '../../types'
import { runGitCommand } from '../git-command'
import type { RemoteWorkspaceProvider } from './shared'

async function ensurePackageManifestExists(source: ResolvedRemoteAuditSource, directory: string) {
  try {
    await access(path.join(directory, 'package.json'))
  } catch {
    throw new PackageManifestNotFoundError(source.repositoryUrl)
  }
}

async function hasRootPackageManifest(directory: string) {
  try {
    await access(path.join(directory, 'package.json'))
    return true
  } catch {
    return false
  }
}

async function readResolvedRef(source: ResolvedRemoteAuditSource, directory: string) {
  const result = await runGitCommand(['-C', directory, 'branch', '--show-current'], {
    source: source.repositoryUrl,
    step: 'read-ref',
  })

  return result.stdout || null
}

async function cleanupWorkspace(directory: string) {
  try {
    await rm(directory, { recursive: true, force: true })
  } catch (error) {
    throw new RemoteWorkspaceCleanupError(directory, error)
  }
}

export const gitCloneProvider: RemoteWorkspaceProvider = {
  name: 'git-clone',
  matches: () => true,
  isConfigured: () => true,
  buildPlan: (source) => ({
    name: 'git-clone',
    // clone provider 的前置 TCP 校验目标就是当前真正要执行的仓库地址。
    connectivityRepositoryUrl: source.repositoryUrl,
    tokenEnvName: null,
  }),
  fetchWorkspace: async (source: ResolvedRemoteAuditSource): Promise<PreparedAuditWorkspace> => {
    const workspaceDirectory = await mkdtemp(
      path.join(tmpdir(), `${LOCKLENS_TEMP_ARTIFACT_PREFIX}remote-`),
    )

    try {
      // clone provider 保持当前 Git 稀疏拉取方案，作为其他 provider 的最终兜底路径。
      await runGitCommand(
        [
          'clone',
          '--depth',
          '1',
          '--filter=blob:none',
          '--no-checkout',
          source.repositoryUrl,
          workspaceDirectory,
        ],
        {
          source: source.repositoryUrl,
          step: 'clone',
        },
      )

      await runGitCommand(['-C', workspaceDirectory, 'sparse-checkout', 'init', '--no-cone'], {
        source: source.repositoryUrl,
        step: 'sparse-init',
      })

      await runGitCommand(
        ['-C', workspaceDirectory, 'sparse-checkout', 'set', ...REMOTE_AUDIT_ROOT_FILES],
        {
          source: source.repositoryUrl,
          step: 'sparse-set',
        },
      )

      // 不同 Git 版本在 sparse-checkout 后是否立刻把文件物化到工作区并不完全一致。
      // 这里补一层 checkout，确保后续 lockfile 检测拿到的是稳定的本地目录结构。
      if (!(await hasRootPackageManifest(workspaceDirectory))) {
        await runGitCommand(['-C', workspaceDirectory, 'checkout', '--quiet'], {
          source: source.repositoryUrl,
          step: 'checkout',
        })
      }

      await ensurePackageManifestExists(source, workspaceDirectory)
      const resolvedRef = await readResolvedRef(source, workspaceDirectory)

      return {
        source: source.inputSource,
        sourceType: 'remote',
        directory: workspaceDirectory,
        repositoryUrl: source.repositoryUrl,
        resolvedRef,
        cleanup: async () => cleanupWorkspace(workspaceDirectory),
      }
    } catch (error) {
      await rm(workspaceDirectory, { recursive: true, force: true })
      throw error
    }
  },
}
