export type InteractiveStorytellingStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InteractiveStorytellingCapability {
  id: string;
  name: string;
  group: string;
  status: InteractiveStorytellingStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}