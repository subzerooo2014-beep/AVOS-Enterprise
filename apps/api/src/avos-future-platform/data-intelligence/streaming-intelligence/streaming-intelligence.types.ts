export type StreamingIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface StreamingIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: StreamingIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}