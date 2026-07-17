export type RetentionAiStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RetentionAiCapability {
  id: string;
  name: string;
  group: string;
  status: RetentionAiStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}