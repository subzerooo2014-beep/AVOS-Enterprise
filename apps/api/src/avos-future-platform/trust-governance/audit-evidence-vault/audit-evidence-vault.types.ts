export type AuditEvidenceVaultStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AuditEvidenceVaultCapability {
  id: string;
  name: string;
  group: string;
  status: AuditEvidenceVaultStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}