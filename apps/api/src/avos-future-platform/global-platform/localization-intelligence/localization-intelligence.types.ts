export type LocalizationIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LocalizationIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: LocalizationIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}