import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { FileSystemInspectorService } from "../shared/file-system-inspector.service";

@Injectable()
export class ArchitectureBoundaryInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.architecture-boundary";
  readonly name = "Inspection Architecture Boundary";
  readonly version = "1.0.0";
  readonly category = "architecture";
  readonly severity = "required" as const;
  readonly priority = 110;
  readonly timeoutMs = 20_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly fsInspector: FileSystemInspectorService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const findings = this.fsInspector.findMatches(
      context.apiRoot,
      [
        /rmSync\s*\(/,
        /unlinkSync\s*\(/,
        /rmdirSync\s*\(/,
        /delete_emails/i,
      ],
      [".ts"],
      1_500,
    ).filter((finding) =>
      finding.file.startsWith("src/inspection-certification-os/"),
    );

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: findings.length === 0 ? "pass" : "fail",
      weight: 15,
      durationMs: 0,
      message:
        findings.length === 0
          ? "Inspection OS remains non-destructive."
          : "Destructive operations were detected inside Inspection OS.",
      evidence: [
        { key: "destructiveOperationFiles", value: findings.length },
        { key: "inspectionCleanupSeparated", value: findings.length === 0 },
      ],
      metrics: [
        { name: "destructiveOperationFiles", value: findings.length },
      ],
      recommendations:
        findings.length === 0
          ? []
          : [
              {
                title: "Remove destructive operations",
                description:
                  "Move cleanup or mutation operations to Cleanup & Optimization OS.",
                priority: "critical",
              },
            ],
      files: findings.map((finding) => finding.file),
    };
  }
}
