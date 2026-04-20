import { access } from "node:fs/promises";
import path from "node:path";

import { InvalidAuditSourceError } from "../errors.js";
import type { ResolvedAuditSource } from "../types.js";

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

function toSshRepositoryUrl(source: string) {
  // 远程仓库统一只走 SSH，不再先尝试 HTTPS。
  // 这样可以从根上避开 HTTPS 私有仓库可能触发的用户名/密码授权弹窗，
  // 让工具行为更接近“无交互、可预测、失败即返回”。
  //
  // 这里的职责是：
  // 1. 保留用户原始输入给 runtime.source
  // 2. 产出真正用于 git clone 的 SSH 地址给 runtime.repositoryUrl
  // 3. 让后续 Git 工作区层不需要再关心协议选择问题，只负责执行
  if (/^git@[^:]+:.+/.test(source)) {
    return source;
  }

  if (source.startsWith("ssh://")) {
    return source;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(source);
  } catch {
    throw new InvalidAuditSourceError(source);
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new InvalidAuditSourceError(source);
  }

  const repositoryPath = parsedUrl.pathname.replace(/^\/+/, "");

  if (!repositoryPath) {
    throw new InvalidAuditSourceError(source);
  }

  return `git@${parsedUrl.host}:${ensureGitSuffix(repositoryPath)}`;
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
      repositoryUrl: toSshRepositoryUrl(normalizedSource),
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
