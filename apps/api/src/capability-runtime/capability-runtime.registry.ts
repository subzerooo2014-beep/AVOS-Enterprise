import {
  CapabilityRuntimeResourcePolicy,
  CapabilityRuntimeState,
} from "./capability-runtime.types";

export const CAPABILITY_RUNTIME_VERSION = "1.0.0";

export const CAPABILITY_RUNTIME_PILLARS = [
  "RUNTIME_CONTEXT",
  "RUNTIME_RESOLUTION",
  "DEPENDENCY_RESOLUTION",
  "LAZY_LOADING",
  "CAPABILITY_LOADING",
  "CAPABILITY_ACTIVATION",
  "CAPABILITY_SUSPENSION",
  "CAPABILITY_RESTART",
  "CAPABILITY_STOP",
  "RUNTIME_ISOLATION",
  "RESOURCE_ALLOCATION",
  "RUNTIME_CACHE",
  "RUNTIME_HEALTH",
  "RUNTIME_DIAGNOSTICS",
  "PERFORMANCE_TRACKING",
] as const;

export const DEFAULT_RUNTIME_RESOURCE_POLICY: CapabilityRuntimeResourcePolicy = {
  maxConcurrency: 10,
  maxQueueDepth: 100,
  timeoutMs: 30_000,
  maxMemoryMb: 256,
  cpuWeight: 100,
  priority: 50,
};

export const CAPABILITY_RUNTIME_TRANSITIONS: Record<
  CapabilityRuntimeState,
  CapabilityRuntimeState[]
> = {
  UNLOADED: ["LOADING", "STOPPED"],
  LOADING: ["READY", "FAILED"],
  READY: ["ACTIVE", "STOPPED", "FAILED"],
  ACTIVE: ["DEGRADED", "SUSPENDED", "STOPPED", "FAILED"],
  DEGRADED: ["ACTIVE", "SUSPENDED", "STOPPED", "FAILED"],
  SUSPENDED: ["ACTIVE", "STOPPED", "FAILED"],
  FAILED: ["LOADING", "STOPPED"],
  STOPPED: ["LOADING"],
};