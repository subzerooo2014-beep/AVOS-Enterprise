import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { FileSystemInspectorService } from "../shared/file-system-inspector.service";

@Injectable()
export class SecretPatternInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.secret-patterns";
  readonly name = "Secret Pattern Inspection";
  readonly version = "1.0.0";
  readonly category = "security";
  readonly severity = "required" as const;
  readonly priority = 90;
  readonly timeoutMs = 60_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly fsInspector: FileSystemInspectorService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const findings = this.fsInspector.findMatches(
      context.repositoryRoot,
      [
        /BEGIN\s+PRIVATE\s+KEY/i,
        /aws_secret_access_key/i,
        /password\s*[:=]\s*["'][^"'${}\s]{8,}["']/i,
        /api[_-]?key\s*[:=]\s*["'][^"'${}\s]{12,}["']/i,
      ],
      [".ts", ".js", ".json", ".yaml", ".yml", ".env", ".md"],
      3_000,
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
          ? "No obvious hard-coded secret patterns were detected."
          : `Potential secret patterns were detected in ${findings.length} files.`,
      evidence: [
        { key: "findingFiles", value: findings.length },
        { key: "scanLimit", value: 3000 },
      ],
      metrics: [{ name: "findingFiles", value: findings.length }],
      recommendations:
        findings.length === 0
          ? []
          : [
              {
                title: "Remove potential hard-coded secrets",
                description:
                  "Review the reported files, rotate exposed credentials, and move secrets to approved secret storage.",
                priority: "critical",
              },
            ],
      files: findings.map((finding) => finding.file),
    };
  }
}
