export type VoiceMacrosStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VoiceMacrosCapability {
  id: string;
  name: string;
  group: string;
  status: VoiceMacrosStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}