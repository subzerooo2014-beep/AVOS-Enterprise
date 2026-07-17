export type MobilityDnaGraphStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MobilityDnaGraphCapability {
  id: string;
  name: string;
  group: string;
  status: MobilityDnaGraphStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}