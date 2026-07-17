export type PrismaGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PrismaGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: PrismaGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}