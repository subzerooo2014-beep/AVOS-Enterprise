export type HyperRuntimePlatformCapability =
  | "HYPER_RUNTIME_FOUNDATION"
  | "HYPER_RUNTIME_ORCHESTRATOR"
  | "AUTONOMOUS_EXECUTION_FABRIC"
  | "DISTRIBUTED_PIPELINE_RUNTIME"
  | "PERSISTENT_EXECUTION_STORE"
  | "EXECUTION_RECOVERY_RESUME"
  | "INCREMENTAL_BUILD_ENGINE"
  | "RUNTIME_SCHEDULER"
  | "RUNTIME_OBSERVABILITY"
  | "RUNTIME_EVIDENCE";

export interface HyperRuntimePlatformRecord {
  id: string;
  capability: HyperRuntimePlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}