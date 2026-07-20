export type CapabilityState =
  | 'registered'
  | 'loading'
  | 'operational'
  | 'degraded'
  | 'updating'
  | 'stopped'
  | 'failed';

export type HealthState = 'healthy' | 'degraded' | 'unhealthy';

export interface CapabilityDescriptor {
  id: string;
  name: string;
  version: string;
  category: string;
  endpoint?: string;
  state: CapabilityState;
  dependencies: string[];
  permissions: string[];
  metadata: Record<string, string | number | boolean>;
  registeredAt: string;
  updatedAt: string;
}

export interface CapabilityHealth {
  capabilityId: string;
  state: HealthState;
  score: number;
  latencyMs: number;
  checkedAt: string;
  details: string[];
}

export interface CapabilityDependencyNode {
  capabilityId: string;
  dependencies: string[];
  dependents: string[];
  missingDependencies: string[];
  cyclic: boolean;
}

export interface CapabilityEvent<T = unknown> {
  id: string;
  topic: string;
  source: string;
  payload: T;
  createdAt: string;
}

export interface CapabilityPermissionDecision {
  capabilityId: string;
  permission: string;
  allowed: boolean;
  reason: string;
}

export interface CapabilityVersionRecord {
  capabilityId: string;
  version: string;
  previousVersion?: string;
  active: boolean;
  deployedAt: string;
}

export interface ZeroDowntimeUpdateResult {
  capabilityId: string;
  fromVersion: string;
  toVersion: string;
  shadowLoaded: boolean;
  healthValidated: boolean;
  trafficSwitched: boolean;
  previousVersionRetained: boolean;
  status: 'completed' | 'rejected';
}