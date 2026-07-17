export type ThreatAnticipationEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ThreatAnticipationEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ThreatAnticipationEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}