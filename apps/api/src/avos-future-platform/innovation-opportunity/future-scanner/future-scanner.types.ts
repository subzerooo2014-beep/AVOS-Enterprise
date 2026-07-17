export type FutureScannerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface FutureScannerCapability {
  id: string;
  name: string;
  group: string;
  status: FutureScannerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}