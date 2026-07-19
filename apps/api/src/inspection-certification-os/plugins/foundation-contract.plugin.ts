import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";

@Injectable()
export class FoundationContractInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.foundation-contract";
  readonly name = "Foundation Contract Inspection";
  readonly version = "1.0.0";
  readonly category = "foundation";
  readonly severity = "required" as const;
  readonly priority = 10;
  readonly timeoutMs = 5_000;
  readonly enabled = true;
  readonly dependencies: readonly string[] = [];

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const valid =
      context.metadata.humanFinalAuthority === true &&
      context.metadata.nonDestructive === true &&
      context.metadata.inspectionCleanupSeparated === true;

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: valid ? "pass" : "fail",
      weight: 50,
      durationMs: 0,
      message: valid
        ? "Foundation inspection contracts are preserved."
        : "Foundation inspection contracts are incomplete.",
      evidence: [
        {
          key: "humanFinalAuthority",
          value: context.metadata.humanFinalAuthority ?? false,
        },
        {
          key: "nonDestructive",
          value: context.metadata.nonDestructive ?? false,
        },
        {
          key: "inspectionCleanupSeparated",
          value: context.metadata.inspectionCleanupSeparated ?? false,
        },
      ],
      metrics: [{ name: "contractCoverage", value: valid ? 100 : 0, unit: "%" }],
      recommendations: [],
      files: [],
    };
  }
}
