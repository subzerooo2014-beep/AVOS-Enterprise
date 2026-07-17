export type DataQualityIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DataQualityIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: DataQualityIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}