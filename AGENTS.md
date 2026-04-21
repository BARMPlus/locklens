# AGENTS.md

本文件用于帮助后续接手本仓库的 Codex / Agent 快速理解项目结构、运行方式与当前约定。

## 项目定位

`locklens` 是一个基于 `audit-ci` 的 lockfile 审计工具，支持两种运行模式：

- MCP Server
- CLI / `npx` 直接调用

当前能力覆盖：

- 本地项目目录审计
- 远程 Git 仓库审计
- `npm` / `yarn` / `pnpm` lockfile 检测
- 统一格式的漏洞输出

## 当前技术栈

- TypeScript
- Node.js ESM
- `tsup` 构建
- `tsx` 运行手动联调脚本
- `eslint` + `lint-staged` + `husky`
- `@modelcontextprotocol/sdk`
- `audit-ci`

## 关键目录

- `src/client.ts`
  - 单入口，负责 CLI 与 MCP 双模式
- `src/cli/`
  - CLI 参数解析与执行
- `src/audit/`
  - 审计核心实现
- `src/tests/`
  - 手动联调入口，不是自动化测试
- `tests/cli/`
  - 正式构建产物驱动的自动化 CLI 测试

## 审计核心结构

- `src/audit/service.ts`
  - 审计总入口 `runPackageAudit(...)`
- `src/audit/lockfile.ts`
  - lockfile 检测
- `src/audit/adapters/library-audit-adapter.ts`
  - npm / pnpm 审计适配
- `src/audit/adapters/yarn-cli-audit-adapter.ts`
  - Yarn 专用适配链路
- `src/audit/git-source/source-resolver.ts`
  - `source` 解析：本地目录 / 远程仓库
- `src/audit/git-workspace/remote-workspace.ts`
  - 远程仓库最小化工作区准备
- `src/audit/normalizers/`
  - 审计结果归一化

## 当前输入模型

统一使用 `source`，不再使用 `directory`：

- 本地目录：`source: "/path/to/project"`
- 远程仓库：`source: "https://github.com/org/repo.git"` 或 `git@host:group/repo.git`

## 远程仓库协议规则

当前远程协议策略如下：

1. `github.com` / `gitlab.com` / `gitee.com`
   - 用户传 HTTPS，会先执行一次非交互 `ssh -T git@host` 探测
   - 如果探测成功，则自动转换成 SSH 执行
   - 如果探测失败或无法明确判断，则继续按 HTTPS 执行
   - 用户传 SSH，则按 SSH 执行

2. 其他域名
   - 如果用户传的是 HTTP(S)，统一转换成 SSH
   - 目的是尽量避免内网 Git 服务触发交互式密码弹窗

远程 Git 执行要求：

- 工具不接管交互认证
- 只支持“本机 Git 已具备无交互访问能力”的仓库
- 在真正执行 `git clone` 之前，会先做一次基于 Git 协议的 TCP 连通性预检查，不使用系统 `ping`
- 远程连通性预检查默认超时为 `5s`，若主机不可达、DNS 失败或目标端口不通，会直接报错，不再进入 Git clone 阶段
- 当前远程 provider 分为三类：
  - `GitLab provider`
    - 仅用于 `gitlab.com`
    - 仅使用 `LOCKLENS_GITLAB_TOKEN`
  - `GitLab Self-Managed provider`
    - 仅用于除 `github.com` / `gitee.com` / `gitlab.com` 外的其他 Git 域名
    - 当前默认把这些域名视为 GitLab 自建实例候选
    - 仅使用 `LOCKLENS_GITLAB_PRIVATE_TOKEN`
  - `Git clone provider`
    - 作为最终兜底路径，保持现有 Git clone 语义
- TCP 连通性预检查是所有远程 provider 的统一前置校验，不属于某一个 provider 内部逻辑
- `LOCKLENS_GITLAB_TOKEN` 与 `LOCKLENS_GITLAB_PRIVATE_TOKEN` 不混用，也不会交叉回退
- Git 命令显式禁用交互提示
- locklens 运行时临时资源统一使用 `locklens-frontend-audit-*` 前缀
- 每次审计启动前都会尝试清理系统临时目录下超过 `24 小时` 的同前缀历史残留
- 正常执行结束后仍会立即执行当前工作区 cleanup；启动前清理只是用于兜底异常退出后的遗留目录/文件

## Yarn 适配说明

Yarn 与 npm / pnpm 的处理是分开的，不要随意合并：

- npm / pnpm
  - 继续使用库模式适配
- Yarn
  - 使用单独的 CLI 适配层

原因：

- `audit-ci` 对 Yarn 的返回结构和 npm / pnpm 不一致
- Yarn 链路有更多协议与输出兼容问题

## 结果结构

当前正式输出只保留：

- `runtime`
- `metadata`
- `advisories`

其中：

- `metadata.vulnerabilities.total`
  - 是去重后各严重级别总和
- `metadata.vulnerabilities.filteredTotal`
  - 应等于当前 `advisories.length`

## 当前命令

### 开发 / 构建

```bash
yarn build
yarn typecheck
yarn lint
```

### 正式 CLI 自动化测试

```bash
yarn test:cli
```

说明：

- 该命令会先构建
- 然后运行 `tests/cli/`
- 测的是 `build/client.js`，不是 `tsx` 开发态入口

### 手动联调

本地：

```bash
yarn test:manual:local
```

远程：

```bash
yarn test:manual:remote
```

说明：

- `src/tests/` 下的文件只是联调脚本
- 不属于正式自动化测试体系

## 发布约定

发布前会自动执行：

```bash
yarn test:cli
```

由 `package.json` 的 `prepublishOnly` 负责触发。

当前 npm 发包白名单只包含：

- `build`
- `README.md`
- `LICENSE`

不会发布 `src/`、`tests/` 等目录。

## 当前 package 元信息

- 包名：`locklens`
- bin：`locklens`
- license：`MIT`
- engines：`node >=18`

## 关于 Node 版本

当前 `engines.node` 设置为：

```json
">=18"
```

原因：

- `@modelcontextprotocol/sdk@1.29.0` 需要 `node >=18`

如果未来要降到 Node 16，优先检查：

- `@modelcontextprotocol/sdk` 是否需要降级
- `src/client.ts` 的 MCP 入口是否仍兼容旧版 SDK

## 维护注意事项

1. 不要把 Yarn 适配逻辑和 npm / pnpm 混在一起
2. 修改远程仓库协议规则时，要同时考虑：
   - GitHub / GitLab / Gitee 公网仓库
   - 公司内网 / 自建 Git 服务
3. 自动化测试应优先验证 `build/client.js`
4. `src/tests/` 是手动联调，不要把它当成正式单测
5. 若修改发布内容，请重新执行：

```bash
npm publish --dry-run
```

确认 tarball 文件列表符合预期
