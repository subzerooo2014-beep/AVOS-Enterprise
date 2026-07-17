export type LogisticsPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LogisticsPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: LogisticsPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}