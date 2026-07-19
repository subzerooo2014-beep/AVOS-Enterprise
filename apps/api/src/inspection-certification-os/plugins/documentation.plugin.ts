import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { FileSystemInspectorService } from "../shared/file-system-inspector.service";

@Injectable()
export class DocumentationInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.documentation";
  readonly name = "Documentation Inspection";
  readonly version = "1.0.0";
  readonly category = "documentation";
  readonly severity = "recommended" as const;
  readonly priority = 100;
  readonly timeoutMs = 10_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly fsInspector: FileSystemInspectorService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const candidates = [
      "README.md",
      "docs",
      "apps/api/README.md",
    ];

    const available = candidates.filter((candidate) =>
      this.fsInspector.exists(join(context.repositoryRoot, candidate)),
    );

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: available.length > 0 ? "pass" : "warn",
      weight: 5,
      durationMs: 0,
      message:
        available.length > 0
          ? "Repository documentation entry points were found."
          : "No primary documentation entry point was found.",
      evidence: [
        { key: "candidateCount", value: candidates.length },
        { key: "availableCount", value: available.length },
      ],
      metrics: [
        {
          name: "documentationEntryCoverage",
          value: (available.length / candidates.length) * 100,
          unit: "%",
        },
      ],
      recommendations:
        available.length > 0
          ? []
          : [
              {
                title: "Create repository documentation",
                description:
                  "Add a root README or docs directory describing setup, architecture, verification, and operations.",
                priority: "medium",
              },
            ],
      files: available,
    };
  }
}
