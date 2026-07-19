import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { InspectionCommandRunnerService } from "../shared/inspection-command-runner.service";

@Injectable()
export class ApiBuildInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.api-build";
  readonly name = "API Production Build Inspection";
  readonly version = "1.0.0";
  readonly category = "build";
  readonly severity = "required" as const;
  readonly priority = 50;
  readonly timeoutMs = 240_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.typescript"] as const;

  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const execution = await this.runner.run(
      "pnpm",
      ["build"],
      context.apiRoot,
      this.timeoutMs,
    );

    const passed = execution.exitCode === 0 && !execution.timedOut;

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: passed ? "pass" : "fail",
      weight: 20,
      durationMs: execution.durationMs,
      message: passed
        ? "API production build completed successfully."
        : "API production build failed.",
      evidence: [
        { key: "exitCode", value: execution.exitCode },
        { key: "timedOut", value: execution.timedOut },
        { key: "stderrPreview", value: execution.stderr.slice(0, 1_500) },
      ],
      metrics: [
        { name: "durationMs", value: execution.durationMs, unit: "ms" },
      ],
      recommendations: passed
        ? []
        : [
            {
              title: "Restore API build health",
              description:
                "Run pnpm build in apps/api and resolve the production build failure.",
              priority: "critical",
            },
          ],
      files: ["apps/api/package.json"],
    };
  }
}
