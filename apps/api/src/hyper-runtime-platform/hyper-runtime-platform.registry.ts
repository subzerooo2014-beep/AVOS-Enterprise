import { HyperRuntimePlatformCapability } from "./hyper-runtime-platform.types";

export const HYPER_RUNTIME_PLATFORM_CAPABILITIES: Readonly<Record<HyperRuntimePlatformCapability, string>> = {
  HYPER_RUNTIME_FOUNDATION: "Hyper Runtime Foundation",
  HYPER_RUNTIME_ORCHESTRATOR: "Hyper Runtime Orchestrator",
  AUTONOMOUS_EXECUTION_FABRIC: "Autonomous Execution Fabric",
  DISTRIBUTED_PIPELINE_RUNTIME: "Distributed Pipeline Runtime",
  PERSISTENT_EXECUTION_STORE: "Persistent Execution Store",
  EXECUTION_RECOVERY_RESUME: "Execution Recovery Resume",
  INCREMENTAL_BUILD_ENGINE: "Incremental Build Engine",
  RUNTIME_SCHEDULER: "Runtime Scheduler",
  RUNTIME_OBSERVABILITY: "Runtime Observability",
  RUNTIME_EVIDENCE: "Runtime Evidence",
};