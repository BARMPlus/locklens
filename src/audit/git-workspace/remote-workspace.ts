import type {
  PreparedAuditWorkspace,
  RemoteWorkspaceProviderPlan,
  ResolvedAuditSource,
  ResolvedRemoteAuditSource,
} from '../types'
import { assertRemoteRepositoryConnectivity } from '../remote-connectivity'
import { gitCloneProvider } from './providers/git-clone-provider'
import { gitlabProvider } from './providers/gitlab-provider'
import { gitlabSelfManagedProvider } from './providers/gitlab-self-managed-provider'
import type { RemoteWorkspaceProvider } from './providers/shared'

const REMOTE_WORKSPACE_PROVIDERS: RemoteWorkspaceProvider[] = [
  gitlabProvider,
  gitlabSelfManagedProvider,
  gitCloneProvider,
]

function selectRemoteWorkspaceProvider(source: ResolvedRemoteAuditSource) {
  for (const provider of REMOTE_WORKSPACE_PROVIDERS) {
    if (!provider.matches(source)) {
      continue
    }

    // API provider 即便“匹配成功”，如果当前没配置对应 token，也不能执行；
    // 这时直接跳过，让后面的 provider 继续参与选择。
    if (provider.name !== 'git-clone' && !provider.isConfigured()) {
      continue
    }

    return provider
  }

  return gitCloneProvider
}

export function resolveRemoteWorkspaceProviderPlan(
  source: ResolvedRemoteAuditSource,
): RemoteWorkspaceProviderPlan {
  // provider plan 是远程编排层的统一决策结果：
  // 它既决定最终命中哪个 provider，也决定 TCP 前置校验到底该检查哪个目标。
  const selectedProvider = selectRemoteWorkspaceProvider(source)
  return selectedProvider.buildPlan(source)
}

export async function prepareAuditWorkspace(
  resolvedSource: ResolvedAuditSource,
): Promise<PreparedAuditWorkspace> {
  if (resolvedSource.kind === 'local') {
    return {
      source: resolvedSource.inputSource,
      sourceType: 'local',
      directory: resolvedSource.localDirectory,
      repositoryUrl: null,
      resolvedRef: null,
      cleanup: async () => {},
    }
  }

  const selectedProvider = selectRemoteWorkspaceProvider(resolvedSource)
  const providerPlan = resolveRemoteWorkspaceProviderPlan(resolvedSource)

  // 这里统一先跑远程前置 TCP 校验。
  // 不管后面最终是 GitLab API 还是 Git clone，都先快速验证“该 provider 实际要访问的目标服务”是否可达。
  await assertRemoteRepositoryConnectivity(
    resolvedSource.inputSource,
    providerPlan.connectivityRepositoryUrl,
  )

  // 前置校验通过后，再把真正的远程文件获取职责交给命中的 provider。
  return selectedProvider.fetchWorkspace(resolvedSource)
}
