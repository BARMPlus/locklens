import net from "node:net";

import { DEFAULT_REMOTE_CONNECTIVITY_TIMEOUT_MS } from "./constants";
import { InvalidAuditSourceError, RemoteConnectivityError } from "./errors";
import type { RemoteConnectivityTarget } from "./types";

function parseScpLikeRepositoryUrl(repositoryUrl: string) {
  const match = /^git@([^:]+):.+$/.exec(repositoryUrl);

  if (!match) {
    return null;
  }

  return {
    protocol: "ssh" as const,
    hostname: match[1],
    port: 22,
    repositoryUrl,
  };
}

export function resolveRemoteConnectivityTarget(
  repositoryUrl: string
): RemoteConnectivityTarget {
  const scpLikeTarget = parseScpLikeRepositoryUrl(repositoryUrl);

  if (scpLikeTarget) {
    return scpLikeTarget;
  }

  try {
    const parsedUrl = new URL(repositoryUrl);

    if (parsedUrl.protocol === "ssh:") {
      return {
        protocol: "ssh",
        hostname: parsedUrl.hostname,
        port: parsedUrl.port ? Number(parsedUrl.port) : 22,
        repositoryUrl,
      };
    }

    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return {
        protocol: "https",
        hostname: parsedUrl.hostname,
        // 这里按产品约定把 HTTP / HTTPS 远程仓库统一探测到 443，
        // 目的是尽量贴近当前 Git 仓库访问场景，而不是区分传统 80/443。
        port: parsedUrl.port ? Number(parsedUrl.port) : 443,
        repositoryUrl,
      };
    }
  } catch {
    // 这里不吞掉异常细节，而是转成统一的来源错误，保证调用方行为一致。
  }

  throw new InvalidAuditSourceError(repositoryUrl);
}

function createConnectivityTimeoutError(timeoutMs: number) {
  const timeoutError = new Error(
    `TCP connection timed out after ${Math.ceil(timeoutMs / 1000)}s.`
  ) as Error & { code?: string };
  timeoutError.code = "ETIMEDOUT";
  return timeoutError;
}

function probeTcpConnectivity(
  target: RemoteConnectivityTarget,
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 这里使用最小 TCP 建连代替系统 ping，
    // 因为很多 Git 服务和公司网络会禁用 ICMP，直接 ping 容易误判。
    const socket = net.createConnection({
      host: target.hostname,
      port: target.port,
    });

    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.removeAllListeners();
      socket.destroy();
      callback();
    };

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      finish(resolve);
    });

    socket.once("timeout", () => {
      finish(() => reject(createConnectivityTimeoutError(timeoutMs)));
    });

    socket.once("error", (error) => {
      finish(() => reject(error));
    });
  });
}

export async function assertRemoteRepositoryConnectivity(
  source: string,
  repositoryUrl: string,
  timeoutMs = DEFAULT_REMOTE_CONNECTIVITY_TIMEOUT_MS
) {
  const target = resolveRemoteConnectivityTarget(repositoryUrl);

  try {
    // 预检查失败时直接短路，避免在明显不可达的场景里继续等待 Git 的更长超时。
    await probeTcpConnectivity(target, timeoutMs);
  } catch (error) {
    throw new RemoteConnectivityError(
      source,
      repositoryUrl,
      target.hostname,
      target.port,
      timeoutMs,
      error
    );
  }
}
