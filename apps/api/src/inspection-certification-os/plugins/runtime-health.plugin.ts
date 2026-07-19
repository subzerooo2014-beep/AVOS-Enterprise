import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";

@Injectable()
export class RuntimeHealthInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.runtime-health";
  readonly name = "Inspection Runtime Health";
  readonly version = "1.0.0";
  readonly category = "runtime";
  readonly severity = "required" as const;
  readonly priority = 20;
  readonly timeoutMs = 5_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.foundation-contract"] as const;

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const valid =
      context.correlationId.length > 0 &&
      context.repositoryRoot.length > 0 &&
      context.apiRoot.length > 0;

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
        ? "Inspection runtime context is healthy."
        : "Inspection runtime context is incomplete.",
      evidence: [
        { key: "correlationIdCreated", value: context.correlationId.length > 0 },
        { key: "repositoryRootResolved", value: context.repositoryRoot.length > 0 },
        { key: "apiRootResolved", value: context.apiRoot.length > 0 },
      ],
      metrics: [{ name: "runtimeContextCoverage", value: valid ? 100 : 0, unit: "%" }],
      recommendations: [],
      files: [],
    };
  }
}
