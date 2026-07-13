import { Injectable } from "@nestjs/common";
import type { FlowComplianceEvidence } from "./core-flow-governance.types";

@Injectable()
export class CoreFlowComplianceService {
  private readonly evidence = new Map<string, FlowComplianceEvidence>();

  record(
    executionId: string,
    control: string,
    status: FlowComplianceEvidence["status"],
    evidence: Record<string, unknown> = {},
  ) {
    const item: FlowComplianceEvidence = {
      id: `evidence_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      control,
      status,
      evidence,
      recordedAt: new Date().toISOString(),
    };

    this.evidence.set(item.id, item);
    return item;
  }

  findAll(query: any = {}) {
    return Array.from(this.evidence.values())
      .filter((item) => !query.executionId || item.executionId === query.executionId)
      .filter((item) => !query.status || item.status === query.status)
      .slice()
      .reverse();
  }

  package(executionId: string) {
    const entries = this.findAll({ executionId });
    const compliant = entries.filter((item) => item.status === "compliant").length;
    const nonCompliant = entries.filter((item) => item.status === "non-compliant").length;

    return {
      executionId,
      entries,
      compliant,
      nonCompliant,
      overallStatus: nonCompliant > 0 ? "non-compliant" : "compliant",
      generatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    const entries = Array.from(this.evidence.values());
    return {
      total: entries.length,
      compliant: entries.filter((item) => item.status === "compliant").length,
      nonCompliant: entries.filter((item) => item.status === "non-compliant").length,
      notApplicable: entries.filter((item) => item.status === "not-applicable").length,
      generatedAt: new Date().toISOString(),
    };
  }
}
