import { runLibraryAuditAdapter } from "./adapters/library-audit-adapter.js";
import { runYarnCliAuditAdapter } from "./adapters/yarn-cli-audit-adapter.js";
import type { AuditCiAdapterInput, AuditCiAdapterResult } from "./types.js";

export async function runAuditCiAdapter(
  input: AuditCiAdapterInput
): Promise<AuditCiAdapterResult> {
  // 这里是 audit 层和第三方 audit-ci 之间的总入口。
  // 外层 service 不需要知道 npm / pnpm / yarn 的具体执行差异，只调用这一层即可。

  // npm / pnpm 保持现有库模式处理，不改变它们已经稳定工作的链路。
  if (input.detection.packageManager !== "yarn") {
    return runLibraryAuditAdapter(input);
  }

  // Yarn 单独走专用链路：
  // 1. 用库模式拿 audit-ci 已归一化的 summary
  // 2. 用 CLI 捕获完整 JSON 输出并解析为 payload
  return runYarnCliAuditAdapter(input);
}
