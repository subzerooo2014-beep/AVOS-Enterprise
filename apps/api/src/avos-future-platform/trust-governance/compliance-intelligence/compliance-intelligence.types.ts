export type ComplianceIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ComplianceIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: ComplianceIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}