export type DurableWorkerStatus =
  | "starting"
  | "active"
  | "degraded"
  | "offline"
  | "retired";

export type DurableWorker = {
  id: string;
  name: string;
  capabilities: string[];
  status: DurableWorkerStatus;
  heartbeatAt: string;
  leaseUntil: string;
  processed: number;
  failed: number;
  createdAt: string;
};

export type DurableMessageStatus =
  | "pending"
  | "processing"
  | "published"
  | "failed"
  | "dead-lettered";
