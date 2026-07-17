export type OperationsCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface OperationsCenterCapability {
  id: string;
  name: string;
  group: string;
  status: OperationsCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}