export type ExplainableAiCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ExplainableAiCenterCapability {
  id: string;
  name: string;
  group: string;
  status: ExplainableAiCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}