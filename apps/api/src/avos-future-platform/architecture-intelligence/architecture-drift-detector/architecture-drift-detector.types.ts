export type ArchitectureDriftDetectorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ArchitectureDriftDetectorCapability {
  id: string;
  name: string;
  group: string;
  status: ArchitectureDriftDetectorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}