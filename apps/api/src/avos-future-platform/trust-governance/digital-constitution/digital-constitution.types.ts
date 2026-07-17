export type DigitalConstitutionStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DigitalConstitutionCapability {
  id: string;
  name: string;
  group: string;
  status: DigitalConstitutionStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}