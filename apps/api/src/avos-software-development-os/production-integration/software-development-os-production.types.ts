export type ProductionCertificationStatus =
  | 'not-certified'
  | 'certified'
  | 'rejected';

export interface ProductionCertificationRecord {
  id: string;
  status: ProductionCertificationStatus;
  score: number;
  approvedBy: string;
  certifiedAt: string;
  checks: Record<string, boolean>;
}

export interface ProductionReadinessSnapshot {
  name: string;
  version: string;
  status: 'operational' | 'degraded';
  score: number;
  checkedAt: string;
  checks: Record<string, boolean>;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
}
