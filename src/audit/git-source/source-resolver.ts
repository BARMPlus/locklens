import { access } from "node:fs/promises";
import path from "node:path";

import { InvalidAuditSourceError } from "../errors";
import type { ResolvedAuditSource } from "../types";

function isRemoteGitSource(source: string) {
  return (
    /^[a-z][a-z0-9+.-]*:\/\//i.test(source) || /^git@[^:]+:.+/.test(source)
  );
}

function ensureGitSuffix(repositoryPath: string) {
  return repositoryPath.endsWith(".git")
    ? repositoryPath
    : `${repositoryPath}.git`;
}

function isPublicGitHost(hostname: string) {
  return hostname === "github.com" || hostname === "gitlab.com";
}

function normalizeRemoteRepositoryUrl(source: string) {
  // 远程来源解析层的协议策略统一收口在这里：
  // 1. GitHub / GitLab 公网地址：
  //    - 用户传 HTTPS，就按 HTTPS 执行
  //    - 用户传 SSH，就按 SSH 执行
  // 2. 其他域名：
  //    - 一律视为更偏私有化的 Git 服务
  //    - 如果用户传的是 HTTP(S)，统一转换成 SSH
  //
  // 这样做的目的，是在兼顾两类场景：
  // 1. 公开仓库地址尽量保持“所见即所得”，避免不必要的协议改写
  // 2. 内网 / 自建 Git 服务默认绕开 HTTPS 口令弹窗，优先走 SSH 无交互链路
  //
  // 这里仍然保留用户原始输入给 runtime.source，
  // 并把真正参与 clone 的地址写入 runtime.repositoryUrl，方便后续排查。
  if (/^git@[^:]+:.+/.test(source)) {
    return source;
  }

  if (source.startsWith("ssh://")) {
    return source;
  }

  try {
    const parsedUrl = new URL(source);

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new InvalidAuditSourceError(source);
    }

    const repositoryPath = parsedUrl.pathname.replace(/^\/+/, "");

    if (!repositoryPath) {
      throw new InvalidAuditSourceError(source);
    }

    if (isPublicGitHost(parsedUrl.hostname)) {
      return source;
    }

    return `git@${parsedUrl.host}:${ensureGitSuffix(repositoryPath)}`;
  } catch {
    throw new InvalidAuditSourceError(source);
  }
}

export async function resolveAuditSource(
  inputSource: string
): Promise<ResolvedAuditSource> {
  const normalizedSource = inputSource.trim();

  if (normalizedSource.length === 0) {
    throw new InvalidAuditSourceError(inputSource);
  }

  // 这一层只负责判断输入来源，不做 clone、下载、网络请求。
  if (isRemoteGitSource(normalizedSource)) {
    return {
      kind: "remote",
      inputSource: normalizedSource,
      repositoryUrl: normalizeRemoteRepositoryUrl(normalizedSource),
    };
  }

  const localDirectory = path.resolve(normalizedSource);

  try {
    await access(localDirectory);
  } catch {
    throw new InvalidAuditSourceError(inputSource);
  }

  return {
    kind: "local",
    inputSource: normalizedSource,
    localDirectory,
  };
}
