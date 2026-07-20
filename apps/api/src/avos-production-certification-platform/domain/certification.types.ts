export type EvidenceDomain =
  | 'database'
  | 'environment'
  | 'observability'
  | 'backup-recovery'
  | 'security'
  | 'performance'
  | 'integration'
  | 'deployment';

export type EvidenceState = 'verified' | 'failed' | 'missing';
export type CertificationState =
  | 'blocked'
  | 'ready-for-human-approval'
  | 'certified'
  | 'suspended'
  | 'revoked';

export interface ProductionEvidence {
  id: string;
  platformId: string;
  domain: EvidenceDomain;
  state: EvidenceState;
  source: string;
  observedAt: string;
  expiresAt?: string;
  checksum: string;
  metadata: Record<string, unknown>;
  simulated: boolean;
}

export interface EvidenceManifest {
  id: string;
  platformId: string;
  version: string;
  createdAt: string;
  evidence: ProductionEvidence[];
  checksum: string;
}

export interface CertificationRecord {
  id: string;
  platformId: string;
  manifestId: string;
  state: CertificationState;
  score: number;
  verifiedDomains: number;
  totalDomains: number;
  approvedBy?: string;
  approvedAt?: string;
  issuedAt?: string;
  expiresAt?: string;
  reasons: string[];
}

export interface PlatformRegistration {
  platformId: string;
  displayName: string;
  version: string;
  owner: string;
  adapterType: 'local' | 'http' | 'event';
  registeredAt: string;
}
