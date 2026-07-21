export type NodeStatus = 'ready' | 'draining' | 'offline';
export type WorkloadStatus =
  | 'pending'
  | 'scheduled'
  | 'running'
  | 'degraded'
  | 'failed'
  | 'completed';

export interface RuntimeNode {
  id: string;
  name: string;
  region: string;
  zone: string;
  status: NodeStatus;
  cpuCapacity: number;
  memoryCapacityMb: number;
  storageCapacityGb: number;
  cpuAllocated: number;
  memoryAllocatedMb: number;
  storageAllocatedGb: number;
  labels: Record<string, string>;
  heartbeatAt: string;
}

export interface RuntimeWorkload {
  id: string;
  name: string;
  capabilityId: string;
  nodeId: string | null;
  status: WorkloadStatus;
  replicas: number;
  desiredReplicas: number;
  cpuRequest: number;
  memoryRequestMb: number;
  priority: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeEvent {
  id: string;
  topic: string;
  source: string;
  severity: 'info' | 'warning' | 'critical';
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface RuntimeCommandResult {
  command: string;
  status: 'accepted' | 'executed' | 'awaiting-human-approval' | 'rejected';
  requiresHumanApproval: boolean;
  action: string;
  timestamp: string;
}

export interface RuntimePolicy {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  enforcement: 'audit' | 'warn' | 'block';
  humanApprovalRequired: boolean;
}

export interface RuntimeSnapshot {
  nodes: RuntimeNode[];
  workloads: RuntimeWorkload[];
  events: RuntimeEvent[];
  policies: RuntimePolicy[];
  savedAt: string;
}