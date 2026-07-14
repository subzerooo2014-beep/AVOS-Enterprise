export const GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES = [
  'enterprise-autonomous-operations-engine',
  'global-operations-orchestrator',
  'autonomous-operations-scheduler',
  'enterprise-command-execution-engine',
  'intelligent-resource-allocation-engine',
  'autonomous-capacity-planning',
  'enterprise-operational-digital-twin',
  'global-operations-intelligence',
  'enterprise-service-orchestration-engine',
  'autonomous-execution-optimization',
  'operations-intelligence-dashboard',
  'global-enterprise-operations-center',
] as const;

export type GlobalAutonomousOperationsCapability =
  (typeof GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES)[number];

export type OperationStatus =
  | 'planned'
  | 'scheduled'
  | 'running'
  | 'blocked'
  | 'completed'
  | 'failed';

export interface GlobalOperation {
  id: string;
  name: string;
  region: string;
  priority: number;
  requiredCapacity: number;
  requiredServices: string[];
  dependencies: string[];
  status: OperationStatus;
}

export interface CapacityPool {
  id: string;
  region: string;
  capacity: number;
  committed: number;
  unitCost: number;
}

export interface ScheduledOperation {
  operationId: string;
  scheduledAt: string;
  sequence: number;
  region: string;
}

export interface CommandExecution {
  commandId: string;
  operationId: string;
  command: string;
  status: 'accepted' | 'executing' | 'completed' | 'rejected';
  executedAt: string;
}

export interface ServiceNode {
  id: string;
  service: string;
  region: string;
  health: number;
  latency: number;
  capacity: number;
}

export interface OperationsDashboardSnapshot {
  generatedAt: string;
  globalReadiness: number;
  activeOperations: number;
  blockedOperations: number;
  availableCapacity: number;
  serviceHealth: number;
  capabilityStatus: Record<
    GlobalAutonomousOperationsCapability,
    'operational'
  >;
}