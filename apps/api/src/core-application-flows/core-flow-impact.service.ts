import { Injectable } from "@nestjs/common";
import type { FlowImpactAssessment } from "./core-flow-change.types";
import { CoreFlowChangeService } from "./core-flow-change.service";

@Injectable()
export class CoreFlowImpactService {
  private readonly assessments: FlowImpactAssessment[] = [];

  constructor(private readonly changes: CoreFlowChangeService) {}

  assess(changeId: string, dto: any = {}) {
    const change = this.changes.findOne(changeId);
    const components = Array.isArray(dto?.affectedComponents)
      ? dto.affectedComponents.map(String)
      : [];
    const flows = Array.isArray(dto?.affectedFlows)
      ? dto.affectedFlows.map(String)
      : [];

    const findings: string[] = [];
    if (components.length >= 5) findings.push("broad-component-impact");
    if (flows.length >= 3) findings.push("multi-flow-impact");
    if (change.riskScore >= 75) findings.push("critical-change-risk");
    if (Boolean(dto?.dataMigration)) findings.push("data-migration-required");
    if (Boolean(dto?.breakingChange)) findings.push("breaking-change");

    const severity: FlowImpactAssessment["severity"] =
      findings.includes("critical-change-risk") || findings.includes("breaking-change")
        ? "critical"
        : findings.length >= 3
          ? "high"
          : findings.length >= 1
            ? "medium"
            : "low";

    const assessment: FlowImpactAssessment = {
      id: `impact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      changeId,
      affectedComponents: components,
      affectedFlows: flows,
      severity,
      findings,
      assessedAt: new Date().toISOString(),
    };

    this.assessments.push(assessment);
    this.changes.markAssessed(changeId);
    return assessment;
  }

  findAll(changeId?: string) {
    return this.assessments
      .filter((item) => !changeId || item.changeId === changeId)
      .slice()
      .reverse();
  }
}
