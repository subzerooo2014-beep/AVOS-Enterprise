export type CapabilityLifecycleState =
  | 'discovered'
  | 'registered'
  | 'initializing'
  | 'active'
  | 'degraded'
  | 'suspended'
  | 'failed'
  | 'retired';

export type RuntimeHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export interface CapabilityDescriptor {
  id: string;
  name: string;
  group: string;
  version: string;
  route?: string;
  dependencies: string[];
  policies: string[];
  tags: string[];
  state: CapabilityLifecycleState;
  health: RuntimeHealthStatus;
  discoveredAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface RuntimeEvent<T = unknown> {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  correlationId?: string;
  causationId?: string;
  payload: T;
  metadata: Record<string, unknown>;
}

export interface RuntimeDecision {
  id: string;
  type: string;
  subject: string;
  outcome: 'allow' | 'deny' | 'review';
  reasons: string[];
  authority: 'system' | 'human' | 'hybrid';
  createdAt: string;
}

export interface RuntimeMetric {
  name: string;
  value: number;
  unit?: string;
  tags: Record<string, string>;
  observedAt: string;
}

export interface RuntimeJob<T = unknown> {
  id: string;
  type: string;
  payload: T;
  status: 'queued' | 'running' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface RuntimeApprovalRequest {
  id: string;
  action: string;
  subject: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  risk: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  reason?: string;
}

export interface RuntimeSnapshot {
  generatedAt: string;
  capabilities: {
    total: number;
    active: number;
    degraded: number;
    failed: number;
  };
  events: number;
  jobs: number;
  approvals: number;
  health: RuntimeHealthStatus;
}