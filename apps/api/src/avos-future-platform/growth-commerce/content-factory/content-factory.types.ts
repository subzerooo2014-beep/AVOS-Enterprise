export type ContentFactoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ContentFactoryCapability {
  id: string;
  name: string;
  group: string;
  status: ContentFactoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}