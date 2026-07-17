export type PodcastFactoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PodcastFactoryCapability {
  id: string;
  name: string;
  group: string;
  status: PodcastFactoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}