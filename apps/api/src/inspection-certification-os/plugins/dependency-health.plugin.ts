import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { InspectionCommandRunnerService } from "../shared/inspection-command-runner.service";

@Injectable()
export class DependencyHealthInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.dependency-health";
  readonly name = "Dependency Health Inspection";
  readonly version = "1.0.0";
  readonly category = "dependencies";
  readonly severity = "recommended" as const;
  readonly priority = 80;
  readonly timeoutMs = 90_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const execution = await this.runner.run(
      "pnpm",
      ["list", "--depth", "0"],
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
      status: passed ? "pass" : "warn",
      weight: 10,
      durationMs: execution.durationMs,
      message: passed
        ? "Top-level dependency resolution is healthy."
        : "Dependency listing reported issues.",
      evidence: [
        { key: "exitCode", value: execution.exitCode },
        { key: "timedOut", value: execution.timedOut },
      ],
      metrics: [
        { name: "durationMs", value: execution.durationMs, unit: "ms" },
      ],
      recommendations: passed
        ? []
        : [
            {
              title: "Review dependency resolution",
              description:
                "Run pnpm list --depth 0 in apps/api and inspect missing or invalid dependencies.",
              priority: "high",
            },
          ],
      files: ["apps/api/package.json", "pnpm-lock.yaml"],
    };
  }
}
