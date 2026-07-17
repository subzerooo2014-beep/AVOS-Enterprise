
import { Injectable } from "@nestjs/common";
import { KnowledgeApprovalService } from "./knowledge-approval.service";
import { KnowledgeAuditService } from "./knowledge-audit.service";
import { KnowledgeComplianceService } from "./knowledge-compliance.service";
import { KnowledgeGovernanceMetricsService } from "./knowledge-governance-metrics.service";
import { KnowledgePolicyEngineService } from "./knowledge-policy-engine.service";
import { KnowledgeQualityService } from "./knowledge-quality.service";
import { KnowledgeGovernanceContext, KnowledgeGovernanceResult, KnowledgeGovernanceSubject } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeGovernanceEngineService {
  constructor(
    private readonly policies: KnowledgePolicyEngineService,
    private readonly quality: KnowledgeQualityService,
    private readonly compliance: KnowledgeComplianceService,
    private readonly approvals: KnowledgeApprovalService,
    private readonly audit: KnowledgeAuditService,
    private readonly metrics: KnowledgeGovernanceMetricsService,
  ) {}

  govern(subject: KnowledgeGovernanceSubject, context: KnowledgeGovernanceContext): KnowledgeGovernanceResult {
    const policy = this.policies.evaluate(subject, context);
    const quality = this.quality.assess(subject);
    const compliance = this.compliance.check(subject);
    const failedCritical = compliance.some((finding) => !finding.compliant && (finding.riskLevel === "HIGH" || finding.riskLevel === "CRITICAL"));
    const decision = policy.decision === "DENY" || failedCritical && context.action === "activate" ? "DENY" : policy.decision === "REVIEW" || quality.overallScore < 70 ? "REVIEW" : "ALLOW";
    const requiresApproval = decision === "REVIEW";
    const approval = requiresApproval ? this.approvals.request(subject.knowledgeId, context.actorId, context.reason) : undefined;
    const audit = this.audit.record({ knowledgeId: subject.knowledgeId, actorId: context.actorId, action: context.action, decision, correlationId: context.correlationId, details: { policy, qualityScore: quality.overallScore, complianceFailures: compliance.filter((item) => !item.compliant).length } });
    this.metrics.record(decision, requiresApproval);
    return { decision, policy: { ...policy, decision }, quality, compliance, requiresApproval, approval, auditId: audit.id };
  }
}