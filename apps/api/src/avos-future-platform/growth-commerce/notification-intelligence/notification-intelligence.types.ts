export type NotificationIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface NotificationIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: NotificationIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}