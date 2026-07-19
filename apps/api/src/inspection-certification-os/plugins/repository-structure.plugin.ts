import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { FileSystemInspectorService } from "../shared/file-system-inspector.service";

@Injectable()
export class RepositoryStructureInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.repository-structure";
  readonly name = "Repository Structure Inspection";
  readonly version = "1.0.0";
  readonly category = "repository";
  readonly severity = "required" as const;
  readonly priority = 30;
  readonly timeoutMs = 10_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.runtime-health"] as const;

  constructor(private readonly fsInspector: FileSystemInspectorService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const required = [
      "package.json",
      "pnpm-workspace.yaml",
      "apps/api/package.json",
      "apps/api/src",
    ];

    const missing = required.filter(
      (item) => !this.fsInspector.exists(join(context.repositoryRoot, item)),
    );

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: missing.length === 0 ? "pass" : "fail",
      weight: 15,
      durationMs: 0,
      message:
        missing.length === 0
          ? "Repository structure is valid."
          : `Missing repository paths: ${missing.join(", ")}`,
      evidence: [
        { key: "requiredPaths", value: required.length },
        { key: "missingPaths", value: missing.length },
      ],
      metrics: [
        {
          name: "repositoryStructureCoverage",
          value: ((required.length - missing.length) / required.length) * 100,
          unit: "%",
        },
      ],
      recommendations:
        missing.length === 0
          ? []
          : [
              {
                title: "Restore repository structure",
                description: `Restore the missing paths: ${missing.join(", ")}`,
                priority: "critical",
              },
            ],
      files: required,
    };
  }
}
