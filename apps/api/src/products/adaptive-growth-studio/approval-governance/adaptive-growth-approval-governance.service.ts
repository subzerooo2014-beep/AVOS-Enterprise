import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthApprovalPolicyService } from "./adaptive-growth-approval-policy.service";
import { AdaptiveGrowthApprovalQueueService } from "./adaptive-growth-approval-queue.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";
import { AdaptiveGrowthDecisionAuditService } from "./adaptive-growth-decision-audit.service";
import { AdaptiveGrowthDecisionEvidenceService } from "./adaptive-growth-decision-evidence.service";
import { AdaptiveGrowthDecisionExplainabilityService } from "./adaptive-growth-decision-explainability.service";
import { AdaptiveGrowthDecisionSignatureService } from "./adaptive-growth-decision-signature.service";
import { AdaptiveGrowthHumanDecisionService } from "./adaptive-growth-human-decision.service";
import { AdaptiveGrowthHumanFinalAuthorityService } from "./adaptive-growth-human-final-authority.service";

@Injectable()
export class AdaptiveGrowthApprovalGovernanceService {
  constructor(
    private readonly queue:
      AdaptiveGrowthApprovalQueueService,
    private readonly policies:
      AdaptiveGrowthApprovalPolicyService,
    private readonly evidence:
      AdaptiveGrowthDecisionEvidenceService,
    private readonly decisions:
      AdaptiveGrowthHumanDecisionService,
    private readonly audit:
      AdaptiveGrowthDecisionAuditService,
    private readonly explainability:
      AdaptiveGrowthDecisionExplainabilityService,
    private readonly authority:
      AdaptiveGrowthHumanFinalAuthorityService,
    private readonly signatures:
      AdaptiveGrowthDecisionSignatureService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
  ) {}

  status() {
    return {
      name:
        "AVOS Adaptive Growth Studio Approval Governance",
      version: "AGS-MP2B-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      machineFinalApprovalAllowed: false,
      foundationApprovalBridgeRemoved: true,
      components: {
        approvalGovernanceEngine: true,
        humanFinalAuthority: true,
        decisionAudit: true,
        approvalQueue: true,
        policyEngine: true,
        decisionSignature: true,
        explainability: true,
        evidenceEngine: true,
        executionCoreIntegration: true,
      },
      queue: this.queue.status(),
      policies: this.policies.status(),
      authority: this.authority.status(),
      signature: this.signatures.status(),
      audit: this.audit.status(),
      storage: this.store.status(),
    };
  }

  request(actionId: string, requestedBy?: string) {
    return this.queue.request(
      actionId,
      requestedBy,
    );
  }

  assign(
    approvalId: string,
    assignedTo: string,
    actor?: string,
  ) {
    return this.queue.assign(
      approvalId,
      assignedTo,
      actor,
    );
  }

  listApprovals(status?: string) {
    return this.queue.list(status);
  }

  getApproval(id: string) {
    return this.queue.get(id);
  }

  collectEvidence(approvalId: string) {
    return this.evidence.collect(
      approvalId,
    );
  }

  addEvidence(
    approvalId: string,
    input: {
      source: string;
      type: string;
      title: string;
      summary: string;
      payload?: Record<string, unknown>;
      confidence?: number;
    },
  ) {
    return this.evidence.add(
      approvalId,
      input,
    );
  }

  listEvidence(approvalId?: string) {
    return this.evidence.list(
      approvalId,
    );
  }

  decide(input: Parameters<
    AdaptiveGrowthHumanDecisionService["decide"]
  >[0]) {
    return this.decisions.decide(input);
  }

  listDecisions() {
    return this.decisions.list();
  }

  getDecision(id: string) {
    return this.decisions.get(id);
  }

  verifyDecision(id: string) {
    return this.decisions.verify(id);
  }

  explain(approvalId: string) {
    return this.explainability.explain(
      approvalId,
    );
  }

  auditTrail(approvalId?: string) {
    return this.audit.list(approvalId);
  }
}