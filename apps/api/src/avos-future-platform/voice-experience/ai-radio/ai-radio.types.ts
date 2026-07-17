export type AiRadioStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AiRadioCapability {
  id: string;
  name: string;
  group: string;
  status: AiRadioStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}