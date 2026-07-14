export const AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES = [
  'autonomous-execution-orchestrator',
  'enterprise-command-center',
  'mission-planning-engine',
  'adaptive-resource-allocation',
  'autonomous-workflow-recovery',
  'real-time-operational-control',
  'enterprise-execution-policy-engine',
  'cross-functional-coordination-mesh',
  'operational-readiness-intelligence',
  'autonomous-operations-dashboard',
] as const;

export type AutonomousEnterpriseOperationCapability =
  (typeof AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES)[number];

export type MissionStatus =
  | 'planned'
  | 'ready'
  | 'running'
  | 'blocked'
  | 'completed'
  | 'failed';

export interface EnterpriseMission {
  id: string;
  objective: string;
  owner: string;
  priority: number;
  requiredCapabilities: string[];
  dependencies: string[];
  status: MissionStatus;
}

export interface ResourcePool {
  name: string;
  available: number;
  committed: number;
  unit: string;
}

export interface ExecutionPolicy {
  id: string;
  name: string;
  maxRiskScore: number;
  requiresApproval: boolean;
  allowedActions: string[];
}

export interface OperationalSignal {
  id: string;
  domain: string;
  health: number;
  capacity: number;
  latency: number;
  observedAt: string;
}

export interface MissionExecutionResult {
  missionId: string;
  approved: boolean;
  readinessScore: number;
  allocatedResources: Record<string, number>;
  actions: string[];
  blockers: string[];
  status: MissionStatus;
}

export interface AutonomousOperationsDashboardSnapshot {
  generatedAt: string;
  readinessScore: number;
  activeMissions: number;
  blockedMissions: number;
  availableCapacity: number;
  capabilityStatus: Record<
    AutonomousEnterpriseOperationCapability,
    'operational'
  >;
}