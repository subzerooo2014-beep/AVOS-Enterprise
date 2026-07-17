
import {
  KnowledgeApprovalRecord,
  KnowledgeGovernanceContext,
  KnowledgeGovernanceResult,
  KnowledgeGovernanceSubject,
  KnowledgeLifecycleState,
  KnowledgePolicyEvaluation,
  KnowledgeQualityAssessment,
} from "./knowledge-governance.types";

export interface KnowledgeGovernanceEngineContract {
  govern(subject: KnowledgeGovernanceSubject, context: KnowledgeGovernanceContext): KnowledgeGovernanceResult;
}

export interface KnowledgePolicyContract {
  evaluate(subject: KnowledgeGovernanceSubject, context: KnowledgeGovernanceContext): KnowledgePolicyEvaluation;
}

export interface KnowledgeQualityContract {
  assess(subject: KnowledgeGovernanceSubject): KnowledgeQualityAssessment;
}

export interface KnowledgeApprovalContract {
  request(knowledgeId: string, requestedBy: string, reason?: string): KnowledgeApprovalRecord;
  decide(id: string, approverId: string, approved: boolean, reason?: string): KnowledgeApprovalRecord;
}

export interface KnowledgeLifecycleContract {
  transition(knowledgeId: string, target: KnowledgeLifecycleState, actorId: string): KnowledgeLifecycleState;
}