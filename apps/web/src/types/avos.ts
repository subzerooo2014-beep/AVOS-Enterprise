export type SystemStatus = 'operational' | 'degraded' | 'offline' | 'unknown';

export interface RuntimeHealth {
  name?: string;
  version?: string;
  status?: SystemStatus | string;
  registeredCapabilities?: number;
  health?: {
    total?: number;
    healthy?: number;
    degraded?: number;
    unhealthy?: number;
    score?: number;
  };
  dependencyValidation?: {
    valid?: boolean;
    missingDependencies?: string[];
    cyclicCapabilities?: string[];
  };
  components?: Record<string, boolean>;
  humanFinalAuthority?: boolean;
  globalComplianceReadinessGate?: boolean;
}

export interface CapabilityRecord {
  id: string;
  name: string;
  version: string;
  category: string;
  state: string;
  dependencies: string[];
  permissions: string[];
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}