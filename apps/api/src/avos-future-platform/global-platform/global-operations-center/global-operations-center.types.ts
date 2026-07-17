export type GlobalOperationsCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GlobalOperationsCenterCapability {
  id: string;
  name: string;
  group: string;
  status: GlobalOperationsCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}