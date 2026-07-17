export type WeakSignalDetectorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface WeakSignalDetectorCapability {
  id: string;
  name: string;
  group: string;
  status: WeakSignalDetectorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}