import { access } from 'node:fs/promises'
import path from 'node:path'

import { InvalidAuditSourceError } from '../errors'
import { probeSshTransportAvailable } from './ssh-transport-probe'

import type { ResolvedAuditSource } from '../types'

function isRemoteGitSource(source: string) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(source) || /^git@[^:]+:.+/.test(source)
}

function ensureGitSuffix(repositoryPath: string) {
  return repositoryPath.endsWith('.git') ? repositoryPath : `${repositoryPath}.git`
}

function isPublicGitHost(hostname: string) {
  return hostname === 'github.com' || hostname === 'gitlab.com' || hostname === 'gitee.com'
}

function buildSshRepositoryUrl(host: string, repositoryPath: string) {
  return `git@${host}:${ensureGitSuffix(repositoryPath)}`
}

export async function normalizeRemoteRepositoryUrlWithOptions(
  source: string,
  probeSshAvailability: (hostname: string) => Promise<boolean> = probeSshTransportAvailable,
) {
  // 远程来源解析层的协议策略统一收口在这里：
  // 1. GitHub / GitLab / Gitee 公网地址：
  //    - 用户传 HTTPS，先探测本机对该 Git 服务器的 SSH 是否可用
  //    - SSH 可用则转换成 SSH，SSH 不可确认则保留 HTTPS
  //    - 用户传 SSH，就按 SSH 执行
  // 2. 其他域名：
  //    - 一律视为更偏私有化的 Git 服务
  //    - 如果用户传的是 HTTP(S)，统一转换成 SSH
  //
  // 这样做的目的，是在兼顾两类场景：
  // 1. 白名单平台尽量优先使用本机已就绪的 SSH Key，减少私有仓库的 HTTPS 授权弹窗
  // 2. SSH 不可确认时仍保留 HTTPS，避免因为探测不稳定误伤公开仓库
  // 3. 内网 / 自建 Git 服务继续默认绕开 HTTPS 口令弹窗，优先走 SSH 无交互链路
  //
  // 这里仍然保留用户原始输入给 runtime.source，
  // 并把真正参与 clone 的地址写入 runtime.repositoryUrl，方便后续排查。
  if (/^git@[^:]+:.+/.test(source)) {
    return source
  }

  if (source.startsWith('ssh://')) {
    return source
  }

  try {
    const parsedUrl = new URL(source)

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new InvalidAuditSourceError(source)
    }

    const repositoryPath = parsedUrl.pathname.replace(/^\/+/, '')

    if (!repositoryPath) {
      throw new InvalidAuditSourceError(source)
    }

    if (isPublicGitHost(parsedUrl.hostname)) {
      // `ssh -T` 只作为 host 级 SSH 可用性判断，不保证对具体仓库一定有权限。
      // 如果探测结果无法明确成功，就保持 HTTPS，避免过度激进地强转协议。
      if (await probeSshAvailability(parsedUrl.hostname)) {
        return buildSshRepositoryUrl(parsedUrl.host, repositoryPath)
      }

      return source
    }

    return buildSshRepositoryUrl(parsedUrl.host, repositoryPath)
  } catch {
    throw new InvalidAuditSourceError(source)
  }
}

export async function resolveAuditSource(inputSource: string): Promise<ResolvedAuditSource> {
  return resolveAuditSourceWithOptions(inputSource)
}

export async function resolveAuditSourceWithOptions(
  inputSource: string,
  options: {
    probeSshAvailability?: (hostname: string) => Promise<boolean>
  } = {},
): Promise<ResolvedAuditSource> {
  const normalizedSource = inputSource.trim()

  if (normalizedSource.length === 0) {
    throw new InvalidAuditSourceError(inputSource)
  }

  // 这一层只负责判断输入来源，不做 clone、下载、网络请求。
  if (isRemoteGitSource(normalizedSource)) {
    return {
      kind: 'remote',
      inputSource: normalizedSource,
      repositoryUrl: await normalizeRemoteRepositoryUrlWithOptions(
        normalizedSource,
        options.probeSshAvailability,
      ),
    }
  }

  const localDirectory = path.resolve(normalizedSource)

  try {
    await access(localDirectory)
  } catch {
    throw new InvalidAuditSourceError(inputSource)
  }

  return {
    kind: 'local',
    inputSource: normalizedSource,
    localDirectory,
  }
}
