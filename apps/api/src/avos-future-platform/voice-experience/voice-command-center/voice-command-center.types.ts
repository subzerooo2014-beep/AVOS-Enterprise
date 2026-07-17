export type VoiceCommandCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceCommandCenterCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceCommandCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}