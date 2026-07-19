import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { InspectionCommandRunnerService } from "../shared/inspection-command-runner.service";

@Injectable()
export class TypeScriptInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.typescript";
  readonly name = "TypeScript Compilation Inspection";
  readonly version = "1.0.0";
  readonly category = "build";
  readonly severity = "required" as const;
  readonly priority = 40;
  readonly timeoutMs = 180_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const execution = await this.runner.run(
      "pnpm",
      ["exec", "tsc", "--noEmit"],
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
        ? "TypeScript compilation completed without errors."
        : "TypeScript compilation failed.",
      evidence: [
        { key: "exitCode", value: execution.exitCode },
        { key: "timedOut", value: execution.timedOut },
        {
          key: "stderrPreview",
          value: execution.stderr.slice(0, 1_500),
        },
      ],
      metrics: [
        { name: "durationMs", value: execution.durationMs, unit: "ms" },
      ],
      recommendations: passed
        ? []
        : [
            {
              title: "Resolve TypeScript compilation errors",
              description:
                "Run pnpm exec tsc --noEmit in apps/api and resolve all reported errors.",
              priority: "critical",
            },
          ],
      files: ["apps/api/tsconfig.json"],
    };
  }
}
