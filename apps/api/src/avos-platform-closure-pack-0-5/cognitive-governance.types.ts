export type GovernanceDecisionType =
  | 'strategic'
  | 'technical-sensitive'
  | 'architecture'
  | 'policy'
  | 'learning'
  | 'multi-agent'
  | 'operational';

export type GovernanceDecisionStatus =
  | 'draft'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'blocked';

export interface GovernanceDecisionInput {
  title: string;
  description: string;
  type: GovernanceDecisionType;
  projectId?: string;
  livingVisionId?: string;
  requestedBy: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  strategicImpact?: boolean;
  technicalSensitivity?: boolean;
  evidence?: string[];
}

export interface GovernanceDecision {
  id: string;
  title: string;
  description: string;
  type: GovernanceDecisionType;
  projectId?: string;
  livingVisionId?: string;
  requestedBy: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  strategicImpact: boolean;
  technicalSensitivity: boolean;
  status: GovernanceDecisionStatus;
  requiresHumanApproval: boolean;
  aiCouncilReviewRequired: boolean;
  policyChecks: GovernancePolicyCheck[];
  councilReview?: AICouncilReview;
  approval?: HumanApprovalRecord;
  createdAt: string;
  updatedAt: string;
}

export interface GovernancePolicyCheck {
  policyId: string;
  name: string;
  passed: boolean;
  blocking: boolean;
  reason: string;
}

export interface AICouncilMemberOpinion {
  role: string;
  recommendation: 'approve' | 'reject' | 'revise';
  confidence: number;
  rationale: string;
}

export interface AICouncilReview {
  reviewId: string;
  decisionId: string;
  consensus: 'approve' | 'reject' | 'revise';
  confidence: number;
  opinions: AICouncilMemberOpinion[];
  reviewedAt: string;
}

export interface HumanApprovalRecord {
  approvedBy: string;
  action: 'approved' | 'rejected';
  reason?: string;
  approvedAt: string;
}

export interface ThinkingConstitutionRule {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  active: boolean;
}

export interface LivingVisionGovernanceLink {
  projectId: string;
  livingVisionId: string;
  linkedAt: string;
  linkedBy: string;
  active: boolean;
}

export interface CognitiveGovernanceStatus {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Enterprise Cognitive Governance Layer';
  metrics: {
    decisions: number;
    pendingHumanApproval: number;
    approved: number;
    rejected: number;
    blocked: number;
    livingVisionLinks: number;
    activeConstitutionRules: number;
  };
  controls: {
    noLearningBeforeGovernance: true;
    noMultiAgentBeforeOrganizationOSAndAICouncil: true;
    humanFinalAuthority: true;
    humanApprovalGate: true;
    aiCouncilRequired: true;
    thinkingConstitutionRequired: true;
    livingVisionRequired: true;
    projectRetrospectiveRequired: true;
  };
}