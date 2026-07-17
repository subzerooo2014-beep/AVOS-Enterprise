import { Injectable } from "@nestjs/common";
import {
  KnowledgeApprovalRecord,
  KnowledgeGovernancePolicy,
  KnowledgeTrustAssessment,
} from "./knowledge-governance.types";

@Injectable()
export class KnowledgeGovernanceRepository {
  private readonly policies = new Map<string, KnowledgeGovernancePolicy>();
  private readonly assessments = new Map<string, KnowledgeTrustAssessment>();
  private readonly approvals = new Map<string, KnowledgeApprovalRecord>();

  savePolicy(policy: KnowledgeGovernancePolicy): KnowledgeGovernancePolicy {
    this.policies.set(policy.id, policy);
    return policy;
  }

  listPolicies(): KnowledgeGovernancePolicy[] {
    return [...this.policies.values()];
  }

  saveAssessment(assessment: KnowledgeTrustAssessment): KnowledgeTrustAssessment {
    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  findAssessment(id: string): KnowledgeTrustAssessment | undefined {
    return this.assessments.get(id);
  }

  listAssessments(): KnowledgeTrustAssessment[] {
    return [...this.assessments.values()];
  }

  saveApproval(approval: KnowledgeApprovalRecord): KnowledgeApprovalRecord {
    this.approvals.set(approval.id, approval);
    return approval;
  }

  listApprovals(): KnowledgeApprovalRecord[] {
    return [...this.approvals.values()];
  }
}