import { parseRemoteRepositoryLocator } from './shared'
import type { RemoteWorkspaceProvider } from './shared'
import { buildGitLabProviderPlan, fetchWorkspaceThroughGitLabApi } from './gitlab-api-shared'
import type { ResolvedRemoteAuditSource } from '../../types'
import { isGitLabSelfManagedCandidateHost } from './shared'

export const LOCKLENS_GITLAB_PRIVATE_TOKEN_ENV = 'LOCKLENS_GITLAB_PRIVATE_TOKEN' as const

export const gitlabSelfManagedProvider: RemoteWorkspaceProvider = {
  name: 'gitlab-self-managed',
  matches: (source: ResolvedRemoteAuditSource) =>
    // 第一版把非 github / gitee / gitlab.com 的其他域名统一视为 GitLab 自建实例候选。
    // 这样能先把大多数公司内网 GitLab 场景跑通，后续若接入更多平台 provider，再细化识别规则。
    isGitLabSelfManagedCandidateHost(parseRemoteRepositoryLocator(source.inputSource).hostname),
  isConfigured: (env = process.env) => Boolean(env[LOCKLENS_GITLAB_PRIVATE_TOKEN_ENV]?.trim()),
  buildPlan: (source) =>
    buildGitLabProviderPlan(source, 'gitlab-self-managed', LOCKLENS_GITLAB_PRIVATE_TOKEN_ENV),
  fetchWorkspace: async (source, env = process.env) =>
    fetchWorkspaceThroughGitLabApi(
      source,
      'gitlab-self-managed',
      LOCKLENS_GITLAB_PRIVATE_TOKEN_ENV,
      env,
    ),
}
