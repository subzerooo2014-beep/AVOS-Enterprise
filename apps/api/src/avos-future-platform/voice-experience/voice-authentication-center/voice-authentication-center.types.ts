export type VoiceAuthenticationCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceAuthenticationCenterCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceAuthenticationCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}