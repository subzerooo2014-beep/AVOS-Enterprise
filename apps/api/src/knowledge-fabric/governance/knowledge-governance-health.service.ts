
import { Injectable } from "@nestjs/common";
import { KnowledgeApprovalService } from "./knowledge-approval.service";
import { KnowledgeGovernanceMetricsService } from "./knowledge-governance-metrics.service";
import { KnowledgePolicyEngineService } from "./knowledge-policy-engine.service";
import { KnowledgeRetentionService } from "./knowledge-retention.service";

@Injectable()
export class KnowledgeGovernanceHealthService {
  constructor(
    private readonly policies: KnowledgePolicyEngineService,
    private readonly approvals: KnowledgeApprovalService,
    private readonly retention: KnowledgeRetentionService,
    private readonly metrics: KnowledgeGovernanceMetricsService,
  ) {}

  status(): Record<string, unknown> {
    return { success: true, system: "AVOS Knowledge Fabric", pack: "KF-4 Knowledge Governance", status: "operational", policyCount: this.policies.list().length, pendingApprovals: this.approvals.list("PENDING").length, retentionPolicies: this.retention.list().length, metrics: this.metrics.snapshot(), checkedAt: new Date().toISOString() };
  }
}