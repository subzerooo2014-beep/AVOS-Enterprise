import { EnterpriseFactoryV3Capability } from "./enterprise-factory-v3.types";

export const ENTERPRISE_FACTORY_V3_CAPABILITIES: Readonly<Record<EnterpriseFactoryV3Capability, string>> = {
  DISTRIBUTED_WORKER_POOL: "Distributed Worker Pool",
  JOB_LEASE_MANAGER: "Job Lease Manager",
  IDEMPOTENT_EXECUTION: "Idempotent Execution",
  GENERATION_CACHE: "Generation Cache",
  REMOTE_FACTORY_AGENT: "Remote Factory Agent",
  SIGNED_ARTIFACTS: "Signed Artifacts",
  FACTORY_OBSERVABILITY: "Factory Observability",
  DEAD_LETTER_QUEUE: "Dead Letter Queue",
  AUTOMATIC_RETRY: "Automatic Retry",
  WORKER_HEALTH: "Worker Health",
  CAPACITY_AUTOSCALING: "Capacity Autoscaling",
  FACTORY_CONTROL_PLANE: "Factory Control Plane",
};