export type AiCouncilStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AiCouncilCapability {
  id: string;
  name: string;
  group: string;
  status: AiCouncilStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}