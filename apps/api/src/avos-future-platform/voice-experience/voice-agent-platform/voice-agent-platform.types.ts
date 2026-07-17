export type VoiceAgentPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceAgentPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceAgentPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}