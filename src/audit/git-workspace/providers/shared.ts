import type {
  PreparedAuditWorkspace,
  RemoteWorkspaceProviderPlan,
  ResolvedRemoteAuditSource,
} from '../../types'

export interface RemoteWorkspaceProvider {
  // provider 名称既用于运行时选择，也会参与后续错误文案和测试断言。
  name: RemoteWorkspaceProviderPlan['name']
  // 只判断“这个 provider 是否应该处理该 source”，不关心当前是否具备执行条件。
  matches: (source: ResolvedRemoteAuditSource) => boolean
  // 用于判断当前 provider 是否具备执行条件，例如是否配置了对应 token。
  isConfigured: (env?: NodeJS.ProcessEnv) => boolean
  // buildPlan 负责产出“本次真正要执行哪个 provider，以及前置 TCP 校验该检查哪个目标”。
  buildPlan: (source: ResolvedRemoteAuditSource) => RemoteWorkspaceProviderPlan
  fetchWorkspace: (
    source: ResolvedRemoteAuditSource,
    env?: NodeJS.ProcessEnv,
  ) => Promise<PreparedAuditWorkspace>
}

export function isGitHubHost(hostname: string) {
  return hostname === 'github.com'
}

export function isGiteeHost(hostname: string) {
  return hostname === 'gitee.com'
}

export function isGitLabHost(hostname: string) {
  return hostname === 'gitlab.com'
}

export function isGitLabSelfManagedCandidateHost(hostname: string) {
  // 第一版不做高置信平台识别。
  // 按当前产品约定，除 github.com / gitee.com / gitlab.com 外，其余域名都先视为 GitLab 自建实例候选。
  return !isGitHubHost(hostname) && !isGiteeHost(hostname) && !isGitLabHost(hostname)
}

export function stripGitSuffix(projectPath: string) {
  return projectPath.replace(/\.git$/i, '')
}

export function parseRemoteRepositoryLocator(source: string) {
  const scpLikeMatch = /^git@([^:]+):(.+)$/.exec(source)

  if (scpLikeMatch) {
    // SSH scp 风格地址没有显式 API 地址，这里统一推导成同 host 的 GitLab API base URL。
    return {
      hostname: scpLikeMatch[1],
      projectPath: stripGitSuffix(scpLikeMatch[2].replace(/^\/+/, '')),
      apiBaseUrl: `https://${scpLikeMatch[1]}/api/v4`,
    }
  }

  const parsedUrl = new URL(source)

  // HTTPS / SSH URL 形式都统一落成“hostname + projectPath + apiBaseUrl”，
  // 后续 provider 和 API 工具层只消费这一份标准化结果。
  return {
    hostname: parsedUrl.hostname,
    projectPath: stripGitSuffix(parsedUrl.pathname.replace(/^\/+/, '')),
    apiBaseUrl: `https://${parsedUrl.host}/api/v4`,
  }
}
