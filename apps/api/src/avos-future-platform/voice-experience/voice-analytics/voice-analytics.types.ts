export type VoiceAnalyticsStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceAnalyticsCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceAnalyticsStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}