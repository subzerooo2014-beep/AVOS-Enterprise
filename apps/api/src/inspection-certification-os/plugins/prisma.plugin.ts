import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { FileSystemInspectorService } from "../shared/file-system-inspector.service";
import { InspectionCommandRunnerService } from "../shared/inspection-command-runner.service";

@Injectable()
export class PrismaInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.prisma";
  readonly name = "Prisma Schema Inspection";
  readonly version = "1.0.0";
  readonly category = "database";
  readonly severity = "required" as const;
  readonly priority = 60;
  readonly timeoutMs = 120_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(
    private readonly runner: InspectionCommandRunnerService,
    private readonly fsInspector: FileSystemInspectorService,
  ) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const schemaPath = join(context.apiRoot, "prisma", "schema.prisma");

    if (!this.fsInspector.exists(schemaPath)) {
      return {
        pluginId: this.id,
        pluginVersion: this.version,
        ruleId: this.id,
        name: this.name,
        category: this.category,
        severity: this.severity,
        status: "fail",
        weight: 15,
        durationMs: 0,
        message: "Prisma schema was not found.",
        evidence: [{ key: "schemaExists", value: false }],
        metrics: [],
        recommendations: [
          {
            title: "Restore Prisma schema",
            description: "Restore apps/api/prisma/schema.prisma.",
            priority: "critical",
          },
        ],
        files: ["apps/api/prisma/schema.prisma"],
      };
    }

    const execution = await this.runner.run(
      "pnpm",
      ["exec", "prisma", "validate"],
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
      weight: 15,
      durationMs: execution.durationMs,
      message: passed
        ? "Prisma schema validation passed."
        : "Prisma schema validation failed.",
      evidence: [
        { key: "schemaExists", value: true },
        { key: "exitCode", value: execution.exitCode },
        { key: "stderrPreview", value: execution.stderr.slice(0, 1_500) },
      ],
      metrics: [
        { name: "durationMs", value: execution.durationMs, unit: "ms" },
      ],
      recommendations: passed
        ? []
        : [
            {
              title: "Resolve Prisma schema errors",
              description:
                "Run pnpm exec prisma validate in apps/api and resolve all schema problems.",
              priority: "critical",
            },
          ],
      files: ["apps/api/prisma/schema.prisma"],
    };
  }
}
