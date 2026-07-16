export type EnterpriseFactoryV3Capability =
  | "DISTRIBUTED_WORKER_POOL"
  | "JOB_LEASE_MANAGER"
  | "IDEMPOTENT_EXECUTION"
  | "GENERATION_CACHE"
  | "REMOTE_FACTORY_AGENT"
  | "SIGNED_ARTIFACTS"
  | "FACTORY_OBSERVABILITY"
  | "DEAD_LETTER_QUEUE"
  | "AUTOMATIC_RETRY"
  | "WORKER_HEALTH"
  | "CAPACITY_AUTOSCALING"
  | "FACTORY_CONTROL_PLANE";

export interface EnterpriseFactoryV3Record {
  id: string;
  capability: EnterpriseFactoryV3Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}