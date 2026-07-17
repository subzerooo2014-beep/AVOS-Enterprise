export type AiCeoAssistantStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AiCeoAssistantCapability {
  id: string;
  name: string;
  group: string;
  status: AiCeoAssistantStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}