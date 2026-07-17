export type ProjectPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ProjectPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: ProjectPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}