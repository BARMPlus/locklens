import type { ResolvedRemoteAuditSource } from "../../types";
import {
  buildGitLabProviderPlan,
  fetchWorkspaceThroughGitLabApi,
} from "./gitlab-api-shared";
import {
  isGitLabHost,
  parseRemoteRepositoryLocator,
  type RemoteWorkspaceProvider,
} from "./shared";

export const LOCKLENS_GITLAB_TOKEN_ENV = "LOCKLENS_GITLAB_TOKEN" as const;

export const gitlabProvider: RemoteWorkspaceProvider = {
  name: "gitlab",
  matches: (source: ResolvedRemoteAuditSource) =>
    // GitLab provider 只接管 gitlab.com，本身不处理任何私有自建域名。
    isGitLabHost(parseRemoteRepositoryLocator(source.inputSource).hostname),
  isConfigured: (env = process.env) =>
    Boolean(env[LOCKLENS_GITLAB_TOKEN_ENV]?.trim()),
  buildPlan: (source) =>
    buildGitLabProviderPlan(source, "gitlab", LOCKLENS_GITLAB_TOKEN_ENV),
  fetchWorkspace: async (source, env = process.env) =>
    fetchWorkspaceThroughGitLabApi(
      source,
      "gitlab",
      LOCKLENS_GITLAB_TOKEN_ENV,
      env
    ),
};
