export interface RuntimeServiceRecordV1 {
  id: string;
  name: string;
  version: string;
  status:
    | "REGISTERED"
    | "STARTING"
    | "READY"
    | "DEGRADED"
    | "STOPPING"
    | "STOPPED"
    | "FAILED";
  dependencies: string[];
  readinessChecks: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeLifecycleEventV1 {
  id: string;
  serviceId: string;
  transition: string;
  fromStatus: RuntimeServiceRecordV1["status"];
  toStatus: RuntimeServiceRecordV1["status"];
  reason?: string;
  createdAt: string;
}

export interface RuntimeRecoveryPlanV1 {
  id: string;
  serviceId: string;
  strategy: "RESTART" | "FAILOVER" | "ISOLATE" | "ROLLBACK";
  status: "CREATED" | "EXECUTING" | "COMPLETED" | "FAILED";
  steps: string[];
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface RuntimeHealthRecordV1 {
  serviceId: string;
  score: number;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  checks: Record<string, boolean>;
  issues: string[];
  checkedAt: string;
}

export interface RuntimeFailoverRecordV1 {
  id: string;
  serviceId: string;
  fromNode: string;
  toNode: string;
  status: "PLANNED" | "COMPLETED" | "FAILED";
  createdAt: string;
  completedAt?: string;
}

export interface RuntimeDiagnosticRecordV1 {
  id: string;
  category: string;
  status: "PASS" | "WARN" | "FAIL";
  details: string[];
  createdAt: string;
}

export interface EnterpriseRuntimeMetricsV1 {
  services: number;
  readyServices: number;
  degradedServices: number;
  failedServices: number;
  lifecycleEvents: number;
  recoveryPlans: number;
  completedRecoveries: number;
  healthRecords: number;
  unhealthyServices: number;
  failovers: number;
  diagnostics: number;
  failedDiagnostics: number;
}

export interface EnterpriseRuntimeStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: EnterpriseRuntimeMetricsV1;
  components: Record<string, string>;
}
