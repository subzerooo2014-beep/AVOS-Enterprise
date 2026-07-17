export type IntegrationMode = 'native' | 'adapter' | 'fallback';

export interface IntegrationComponentStatus {
  component: string;
  mode: IntegrationMode;
  connected: boolean;
  healthy: boolean;
  details: Record<string, unknown>;
  checkedAt: string;
}

export interface KernelRegistration {
  id: string;
  type: 'service' | 'capability' | 'adapter' | 'transport';
  version: string;
  owner: string;
  dependencies: string[];
  metadata: Record<string, unknown>;
}

export interface PersistentRuntimeRecord {
  id: string;
  namespace: string;
  type: string;
  key: string;
  payload: unknown;
  version: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationSnapshot {
  generatedAt: string;
  ready: boolean;
  mode: IntegrationMode;
  components: IntegrationComponentStatus[];
  kernelRegistrations: number;
  persistentRecords: number;
  bridgeEvents: number;
  validationErrors: string[];
}

export interface StartupValidationResult {
  success: boolean;
  checkedAt: string;
  errors: string[];
  warnings: string[];
  checks: Array<{
    name: string;
    success: boolean;
    details?: Record<string, unknown>;
  }>;
}