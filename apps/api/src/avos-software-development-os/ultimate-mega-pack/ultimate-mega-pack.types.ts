export interface UltimateDomainStatus {
  domain: string;
  status: 'operational' | 'degraded';
  score: number;
  capabilities: string[];
  capabilityCount: number;
  foundationFirst: boolean;
  capabilityFirst: boolean;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
  checkedAt: string;
}

export interface UltimateCertification {
  id: string;
  name: string;
  version: string;
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  certifiedAt: string;
  checks: Record<string, boolean>;
  domainScores: Record<string, number>;
}
