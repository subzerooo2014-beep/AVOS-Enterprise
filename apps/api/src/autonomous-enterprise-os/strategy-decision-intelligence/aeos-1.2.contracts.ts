export type Aeos12OperationalStatus = 'operational' | 'degraded';

export interface Aeos12Status {
  name: string;
  version: 'AEOS-1.2.0';
  status: Aeos12OperationalStatus;
  score: number;
  megaPacks: Record<string, 'operational'>;
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  capturedAt: string;
}
