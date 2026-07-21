export type OmegaLifecycleStatus =
  | 'created'
  | 'operational'
  | 'pending-human-approval'
  | 'verified'
  | 'certified'
  | 'rejected';

export interface OmegaBlueprint {
  id: string;
  name: string;
  version: string;
  status: OmegaLifecycleStatus;
  principles: string[];
  capabilities: string[];
  updatedAt: string;
}

export interface OmegaAiTeam {
  id: string;
  name: string;
  specialty: string;
  responsibilities: string[];
  active: boolean;
}

export interface OmegaDecision {
  id: string;
  type: string;
  summary: string;
  requiresHumanApproval: boolean;
  approved: boolean;
  approvedBy?: string;
  createdAt: string;
}

export interface OmegaVerificationResult {
  status: 'passed' | 'failed';
  score: number;
  checks: Record<string, boolean>;
  verifiedAt: string;
}

export interface OmegaCertification {
  id: string;
  name: string;
  version: string;
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  checks: Record<string, boolean>;
  certifiedAt: string;
}