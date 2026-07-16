export type BusinessComponentType =
  | "SALES"
  | "INVENTORY"
  | "CUSTOMER"
  | "FINANCE"
  | "ORDER"
  | "PROCUREMENT"
  | "OPERATIONS"
  | "WORKFLOW"
  | "ANALYTICS"
  | "UNKNOWN";

export interface BusinessComponentRecord {
  id: string;
  name: string;
  type: BusinessComponentType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "DISCOVERED" | "ACTIVE";
  discoveredAt: string;
}

export interface BusinessKpiDefinition {
  id: string;
  name: string;
  domain: string;
  unit: string;
  target?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  enabled: boolean;
  version: string;
}

export interface BusinessKpiMeasurement {
  id: string;
  kpiId: string;
  value: number;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "UNKNOWN";
  measuredAt: string;
  metadata?: Record<string, unknown>;
}

export interface BusinessRuleRecord {
  id: string;
  name: string;
  domain: string;
  version: string;
  priority: number;
  enabled: boolean;
  conditions: Record<string, unknown>;
  action: string;
}

export interface BusinessProcessRecord {
  id: string;
  name: string;
  domain: string;
  status:
    | "PENDING"
    | "RUNNING"
    | "WAITING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";
  currentStep?: string;
  steps: string[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface SlaDefinitionRecord {
  id: string;
  name: string;
  domain: string;
  targetMinutes: number;
  warningMinutes: number;
  enabled: boolean;
}

export interface SlaMeasurementRecord {
  id: string;
  slaId: string;
  processId: string;
  elapsedMinutes: number;
  status: "WITHIN_SLA" | "WARNING" | "BREACHED";
  measuredAt: string;
}

export interface BusinessOperationsMetrics {
  components: number;
  kpis: number;
  measurements: number;
  healthyKpis: number;
  warningKpis: number;
  criticalKpis: number;
  rules: number;
  processes: number;
  runningProcesses: number;
  completedProcesses: number;
  failedProcesses: number;
  slaDefinitions: number;
  slaBreaches: number;
}

export interface BusinessOperationsHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: BusinessOperationsMetrics;
  components: Record<string, string>;
}
