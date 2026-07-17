export type TestGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface TestGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: TestGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}