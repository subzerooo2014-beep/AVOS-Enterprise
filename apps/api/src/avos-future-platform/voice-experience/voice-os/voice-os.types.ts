export type VoiceOsStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceOsCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceOsStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}