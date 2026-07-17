export type UniversalVoiceBusStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface UniversalVoiceBusCapability {
  id: string;
  name: string;
  group: string;
  status: UniversalVoiceBusStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}