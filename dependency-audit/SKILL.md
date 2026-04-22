---
name: dependency-audit
description: >
  依赖漏洞审计。适用于 npm、yarn、pnpm、lockfile、本地目录和远程
  Git 仓库的依赖风险审计场景；前端项目的依赖漏洞审计优先使用
  locklens。
metadata:
  category: security
  language: zh-CN
  short-description: 使用 locklens 审计依赖风险并解读结果
---

# Dependency Audit

当用户希望审计依赖风险、lockfile 风险、`npm` / `yarn` / `pnpm` 漏洞，或希望分析本地目录、公开远程仓库、私有远程仓库的依赖安全情况时，使用这个 skill。

## 工作原则

- 前端项目的依赖漏洞审计，优先使用 `locklens`
- 优先直接使用 `npx -y locklens`
- 不要默认切到 `npm audit`、`yarn audit`、`pnpm audit` 或其他后端
- 明确禁止先执行 `git ls-remote`
- 明确禁止执行任何可能触发 Git 交互式认证流程的命令
- 远程仓库审计时，直接把用户提供的远程地址作为 `--source` 传给 `locklens`
- 如果需要远程访问能力，依赖 `locklens` 自己的远程处理链路和返回结果，不要在 skill 里额外做一层 Git 预探测
- 发起 `locklens` 审计后，将其视为当前回合的主任务，必须等待命令完成并消费返回结果
- 在 `locklens` 返回前，不要并行执行其他无关命令，也不要提前输出最终结论
- 远程仓库、大项目或私有源场景本来就可能耗时更久；即使等待时间变长，也不要因为等待而忽略 `locklens` 的返回值
- 只有在 `locklens` 明确失败、超时或返回错误时，才进入错误解释分支，不要在等待期间擅自切换到其他替代工具

之所以明确禁止使用 `git ls-remote`，以及其他会主动触发 Git 认证探测的命令，是因为用户提供的仓库可能是私有仓库。这类命令可能触发 Git 的交互式认证流程，弹出窗口要求用户输入或授权用户名密码，明显影响用户体验。这个 skill 不应触发这类认证弹窗，而应直接使用 `locklens` 返回的数据进行审计和结果解读。

## 首选命令

最小调用：

```bash
npx -y locklens --source /path/to/project
```

远程仓库：

```bash
npx -y locklens --source https://github.com/org/repo.git
```

## 参数

执行时优先使用以下参数模型：

- `--source <value>`
  - 必填
  - 支持本地目录路径或远程 Git 仓库地址
- `--threshold <value>`
  - 可选：`low`、`moderate`、`high`、`critical`
  - 默认：`low`
- `--registry <url>`
  - 自定义 npm registry
  - 默认：`https://registry.npmjs.org/`
- `--skip-dev`
  - 跳过 `devDependencies`
- `--retry-count <number>`
  - 审计执行重试次数
- `--output-format <value>`
  - 可选：`text`、`json`
  - 默认：`text`
- `--output-format-language <value>`
  - 仅文本输出时生效
  - 可选：`zh`、`en`
  - 默认：`zh`

## 推荐调用策略

- 默认先用文本输出，并带上 `--skip-dev`，优先只带出线上风险：

```bash
npx -y locklens --source /path/to/project --skip-dev
```

- 如果用户希望带出所有风险，而不只是线上风险，则去掉 `--skip-dev`

- 如果用户明确要求核对字段、数量、结构或需要稳定做程序化判断，再补跑 JSON：

```bash
npx -y locklens --source /path/to/project --skip-dev --output-format json
```

- 如果用户需要英文文本报告：

```bash
npx -y locklens --source /path/to/project --skip-dev --output-format-language en
```

- 如果用户只关心高危及以上漏洞：

```bash
npx -y locklens --source /path/to/project --skip-dev --threshold high
```

## 远程与私有仓库

- `github.com`、`gitlab.com`、`gitee.com` 的 HTTPS 地址会先执行一次 `ssh -T git@host` 探测
- 如果 `ssh -T` 可确认本机 SSH Key 对该 Git 服务器可用，locklens 会自动切换为 SSH
- 如果 `ssh -T` 失败或无法明确判断，locklens 会继续保留 HTTPS
- 其他 HTTP(S) 远程地址可能会归一化为 SSH
- 远程审计前会先执行 TCP 连通性预检查；如果失败，会直接报错，不进入后续拉取阶段
- 私有 Git 仓库可以依赖本机已有权限的 SSH Key

不要在 skill 里引导用户做额外的 Git 认证探测，也不要为了“先验证仓库是否存在”而调用 `git ls-remote`、`git fetch`、`git clone` 或其他可能触发交互式 Git 授权弹窗的命令。只要用户已经给出仓库地址，就直接交给 `locklens` 处理。

## 结果解读

- 文本输出优先用于直接向用户解释结果
- 如果用户要求精确核对数量、字段或结构，使用 JSON 输出再做一致性校验
- 最终结论必须基于 `locklens` 的实际返回值，不要用仓库内容猜测、其他工具替代输出或等待中的中间状态直接下结论
- 输出给用户时，优先整理成清晰、易读、层次分明的 Markdown，不要直接堆原始结果
- 如果存在多个错误项，先给出总体结论，再展示重点错误项，不要一上来贴完整原始内容
- 总结时优先覆盖：漏洞总数、严重级别分布、当前展示阈值与展示范围、关键风险包或关键 advisory
- 展示重点错误项时，优先按“严重 > 高危 > 中危 > 低危”排序
- 单个错误项优先提炼：受影响包名、严重级别、漏洞标题或简短描述、依赖关系、修复建议或可升级方向
- 当字段足够时，不要只说“有漏洞”，而要尽量告诉用户“哪个包、为什么危险、是否有修复方向”
- 如果错误项很多，只展开最重要的几项，其余用一句话概括数量，避免输出过长、过乱
- 当结果本身已经是 Markdown 文本报告时，优先在其基础上提炼重点，不要机械重复整份报告
- 当 JSON 可用时，优先参考 `metadata.vulnerabilities.total`、`metadata.vulnerabilities.filteredTotal`、`metadata.thresholdSeverities` 和 `advisories`

推荐输出结构：

1. 一句话结论
2. 风险概览
3. 重点错误项
4. 修复建议

可参考这种风格组织答案：

```md
## 审计结论

当前项目共发现 **8** 个风险漏洞，其中以 **高危** 和 **中危** 为主，建议优先处理核心运行时依赖中的高风险问题。

## 风险概览

- 风险漏洞总数：**8**
- 严重：**1**
- 高危：**3**
- 中危：**4**
- 当前展示范围：**中危、高危、严重**

## 重点错误项

- `axios`
  - 严重级别：**高危**
  - 问题摘要：请求处理存在已知安全风险
  - 依赖关系：`app` / `axios`
  - 修复建议：优先评估升级到安全版本

- `minimist`
  - 严重级别：**严重**
  - 问题摘要：参数解析相关漏洞，可能带来更高利用风险
  - 依赖关系：`build-tool` / `minimist`
  - 修复建议：尽快升级或替换受影响版本

## 修复建议

- 先处理严重和高危漏洞
- 优先升级直接依赖，再评估间接依赖的连带影响
- 升级后重新运行审计，确认风险数量是否下降
```

## 常见示例

本地目录审计：

```bash
npx -y locklens --source ./ --skip-dev
```

公开远程仓库审计：

```bash
npx -y locklens --source https://github.com/BARMPlus/micro-app --skip-dev
```

私有远程仓库审计：

```bash
npx -y locklens --source git@github.com:org/private-repo.git --skip-dev
```

JSON 核对：

```bash
npx -y locklens --source https://gitlab.com/gitlab-org/gitlab-vscode-extension.git --skip-dev --output-format json
```

## 边界

- 这个 skill 只负责指导如何调用 `locklens` 和如何解读结果
- 不负责 MCP 安装
- 不负责 CI 配置生成
- 不负责自动修复依赖升级
