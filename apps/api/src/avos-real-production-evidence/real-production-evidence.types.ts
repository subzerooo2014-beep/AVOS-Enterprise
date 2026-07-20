export type RealProductionDomain =
  | 'database'
  | 'environment'
  | 'observability'
  | 'backup-recovery'
  | 'security'
  | 'performance'
  | 'integration'
  | 'deployment';

export interface RealProductionEvidenceRecord {
  domain: RealProductionDomain;
  passed: boolean;
  evidence: string[];
  blockers: string[];
  artifacts: string[];
  executedAt: string;
  source: 'real-execution';
}

export interface RealProductionEvidenceManifest {
  runId: string;
  approvedBy: string;
  generatedAt: string;
  source: 'real-execution';
  evidence: RealProductionEvidenceRecord[];
  manifestHash?: string;
}

export interface RealProductionCertification {
  id: string;
  status: 'blocked' | 'certified';
  score: number;
  verifiedDomains: number;
  totalDomains: number;
  failedDomains: RealProductionDomain[];
  manifestHash: string;
  approvedBy?: string;
  certifiedAt?: string;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
}
