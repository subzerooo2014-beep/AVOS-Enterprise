export type EvolutionProposalStatus =
  | 'draft'
  | 'analyzing'
  | 'awaiting-approval'
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'implemented'
  | 'rolled-back';

export interface EvolutionProposalInput {
  projectId: string;
  livingVisionId: string;
  title: string;
  description: string;
  proposedBy: string;
  strategic: boolean;
  affectedComponents: string[];
  expectedBenefits: string[];
  risks: string[];
}

export interface EvolutionProposal {
  id: string;
  projectId: string;
  livingVisionId: string;
  title: string;
  description: string;
  proposedBy: string;
  strategic: boolean;
  affectedComponents: string[];
  expectedBenefits: string[];
  risks: string[];
  status: EvolutionProposalStatus;
  impactScore: number;
  riskScore: number;
  requiresRecertification: boolean;
  approvedBy?: string;
  implementationPlanId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradePlan {
  id: string;
  proposalId: string;
  steps: string[];
  rollbackPlan: string[];
  validationChecks: string[];
  status: 'created' | 'approved' | 'executing' | 'completed' | 'failed';
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionAuditRecord {
  id: string;
  proposalId: string;
  action: string;
  performedBy: string;
  details: string;
  createdAt: string;
}

export interface Pack7Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Continuous Evolution, Upgrade Governance & Strategic Improvement Runtime';
  metrics: {
    proposals: number;
    awaitingApproval: number;
    approved: number;
    implemented: number;
    rolledBack: number;
    upgradePlans: number;
    completedUpgrades: number;
    recertificationRequired: number;
    auditRecords: number;
  };
  controls: {
    postCertificationEvolution: true;
    strategicHumanApproval: true;
    impactAnalysisBeforeChange: true;
    riskAssessmentBeforeChange: true;
    rollbackPlanRequired: true;
    validationBeforeCompletion: true;
    recertificationGate: true;
    livingVisionAlignment: true;
    immutableAuditTrail: true;
    noSilentStrategicEvolution: true;
  };
}