import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  GitLabApiAuthenticationError,
  GitLabApiNotFoundError,
  GitLabApiResponseError,
  PackageManifestNotFoundError,
  RemoteWorkspaceCleanupError,
} from '../../errors'
import { LOCKLENS_TEMP_ARTIFACT_PREFIX, REMOTE_AUDIT_ROOT_FILES } from '../../constants'
import type { PreparedAuditWorkspace, ResolvedRemoteAuditSource } from '../../types'
import { parseRemoteRepositoryLocator } from './shared'

interface GitLabApiContext {
  providerName: 'gitlab' | 'gitlab-self-managed'
  envName: string
  token: string
}

function normalizeGitLabToken(env: NodeJS.ProcessEnv, envName: string) {
  // provider 是否“已配置”由上层判断，这里只负责把实际 token 读出来并校验非空，
  // 这样 API 层出错时可以明确告诉调用方是哪个环境变量有问题。
  const token = env[envName]?.trim()

  if (!token) {
    throw new GitLabApiResponseError(
      `Environment variable ${envName} is required for this provider.`,
      envName === 'LOCKLENS_GITLAB_TOKEN' ? 'gitlab' : 'gitlab-self-managed',
      envName,
      envName,
    )
  }

  return token
}

async function fetchGitLabJson(
  url: string,
  source: ResolvedRemoteAuditSource,
  context: GitLabApiContext,
) {
  // 这里统一使用 GitLab 的 PRIVATE-TOKEN Header。
  // GitLab SaaS 和 GitLab 自建实例都复用这一套协议，只是 provider 与 token 来源不同。
  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': context.token,
    },
  })

  if (response.status === 401 || response.status === 403) {
    throw new GitLabApiAuthenticationError(
      context.providerName,
      context.envName,
      source.inputSource,
    )
  }

  if (response.status === 404) {
    throw new GitLabApiNotFoundError(context.providerName, context.envName, source.inputSource)
  }

  if (!response.ok) {
    throw new GitLabApiResponseError(
      `GitLab API returned HTTP ${response.status} for ${url}.`,
      context.providerName,
      context.envName,
      source.inputSource,
    )
  }

  return response.json()
}

async function fetchGitLabRawFile(
  url: string,
  source: ResolvedRemoteAuditSource,
  context: GitLabApiContext,
) {
  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': context.token,
    },
  })

  if (response.status === 401 || response.status === 403) {
    throw new GitLabApiAuthenticationError(
      context.providerName,
      context.envName,
      source.inputSource,
    )
  }

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new GitLabApiResponseError(
      `GitLab API returned HTTP ${response.status} for ${url}.`,
      context.providerName,
      context.envName,
      source.inputSource,
    )
  }

  return response.text()
}

export function buildGitLabProviderPlan(
  source: ResolvedRemoteAuditSource,
  providerName: 'gitlab' | 'gitlab-self-managed',
  envName: string,
) {
  const locator = parseRemoteRepositoryLocator(source.inputSource)

  return {
    name: providerName,
    // GitLab API provider 的前置 TCP 校验目标不再是归一化后的仓库 SSH 地址，
    // 而是后续真正要访问的 API base URL，避免把 API provider 错误地校验到 22 端口。
    connectivityRepositoryUrl: locator.apiBaseUrl,
    tokenEnvName: envName,
  } as const
}

export async function fetchWorkspaceThroughGitLabApi(
  source: ResolvedRemoteAuditSource,
  providerName: 'gitlab' | 'gitlab-self-managed',
  envName: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<PreparedAuditWorkspace> {
  const locator = parseRemoteRepositoryLocator(source.inputSource)
  const encodedProjectPath = encodeURIComponent(locator.projectPath)
  const token = normalizeGitLabToken(env, envName)
  const context: GitLabApiContext = {
    providerName,
    envName,
    token,
  }
  const projectUrl = `${locator.apiBaseUrl}/projects/${encodedProjectPath}`
  const project = (await fetchGitLabJson(projectUrl, source, context)) as {
    default_branch?: unknown
  }
  const defaultBranch =
    typeof project.default_branch === 'string' && project.default_branch.trim().length > 0
      ? project.default_branch
      : null

  if (!defaultBranch) {
    throw new GitLabApiResponseError(
      'The GitLab API response does not contain a valid default branch.',
      providerName,
      envName,
      source.inputSource,
    )
  }

  const workspaceDirectory = await mkdtemp(
    path.join(tmpdir(), `${LOCKLENS_TEMP_ARTIFACT_PREFIX}${providerName}-`),
  )

  try {
    let hasPackageManifest = false

    for (const fileName of REMOTE_AUDIT_ROOT_FILES) {
      // 第一版只拉取根目录固定文件集合，保持和现有 lockfile 检测逻辑一致，
      // 不在这里扩展 monorepo 子目录或任意路径拉取能力。
      const rawFileUrl =
        `${locator.apiBaseUrl}/projects/${encodedProjectPath}` +
        `/repository/files/${encodeURIComponent(fileName)}/raw?ref=${encodeURIComponent(defaultBranch)}`
      const content = await fetchGitLabRawFile(rawFileUrl, source, context)

      if (content == null) {
        continue
      }

      await writeFile(path.join(workspaceDirectory, fileName), content, 'utf8')

      if (fileName === 'package.json') {
        hasPackageManifest = true
      }
    }

    // 远程 API provider 也必须保证最终产物里存在根 package.json，
    // 这样后面的 detectLockfile 与 audit-ci 适配层才能完全复用现有语义。
    if (!hasPackageManifest) {
      throw new PackageManifestNotFoundError(source.inputSource)
    }

    return {
      source: source.inputSource,
      sourceType: 'remote',
      directory: workspaceDirectory,
      repositoryUrl: source.repositoryUrl,
      resolvedRef: defaultBranch,
      cleanup: async () => {
        try {
          await rm(workspaceDirectory, { recursive: true, force: true })
        } catch (error) {
          throw new RemoteWorkspaceCleanupError(workspaceDirectory, error)
        }
      },
    }
  } catch (error) {
    await rm(workspaceDirectory, { recursive: true, force: true })
    throw error
  }
}
