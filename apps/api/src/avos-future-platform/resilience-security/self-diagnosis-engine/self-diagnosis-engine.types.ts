export type SelfDiagnosisEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SelfDiagnosisEngineCapability {
  id: string;
  name: string;
  group: string;
  status: SelfDiagnosisEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}