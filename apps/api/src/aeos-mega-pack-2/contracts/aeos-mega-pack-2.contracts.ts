export type AeosStageId =
  | 'AEOS-1.3'
  | 'AEOS-1.4'
  | 'AEOS-1.5'
  | 'AEOS-1.6'
  | 'AEOS-1.7'
  | 'AEOS-1.8'
  | 'AEOS-1.9'
  | 'AEOS-2.0';

export type AeosLifecycleStatus =
  | 'registered'
  | 'operational'
  | 'degraded'
  | 'failed'
  | 'certified';

export interface AeosStageDescriptor {
  id: AeosStageId;
  name: string;
  version: string;
  status: AeosLifecycleStatus;
  capabilities: string[];
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
}

export interface AeosExecutionContext {
  objective: string;
  requestedBy?: string;
  jurisdiction?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface AeosEvidence {
  source: string;
  kind: string;
  confidence: number;
  detail: string;
}

export interface AeosDecisionGate {
  requiresHumanApproval: boolean;
  authority: 'human-final-authority';
  reason: string;
}

export interface AeosStageResult<T = Record<string, unknown>> {
  stage: AeosStageId;
  status: 'completed' | 'blocked' | 'failed';
  score: number;
  output: T;
  evidence: AeosEvidence[];
  gate: AeosDecisionGate;
  timestamp: string;
}

export interface AeosCertificationReport {
  id: string;
  name: string;
  version: 'AEOS-2.0.0';
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  checks: Record<string, boolean>;
  stages: AeosStageDescriptor[];
  certifiedAt: string;
}
