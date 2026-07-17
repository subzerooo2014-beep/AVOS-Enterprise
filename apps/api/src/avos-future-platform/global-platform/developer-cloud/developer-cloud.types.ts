export type DeveloperCloudStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DeveloperCloudCapability {
  id: string;
  name: string;
  group: string;
  status: DeveloperCloudStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}