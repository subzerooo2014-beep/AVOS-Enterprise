export type ClusterNodeStatus =
  | "joining"
  | "active"
  | "leader"
  | "degraded"
  | "offline"
  | "retired";

export type ClusterNode = {
  id: string;
  name: string;
  region: string;
  capacity: number;
  load: number;
  status: ClusterNodeStatus;
  leaseUntil: string;
  heartbeatAt: string;
  createdAt: string;
};

export type DistributedScheduleRecord = {
  id: string;
  executionId: string;
  partitionKey: string;
  targetNodeId: string;
  executeAt: string;
  status: "scheduled" | "dispatched" | "cancelled";
  createdAt: string;
};

export type CapacityDecision = {
  desiredWorkers: number;
  currentWorkers: number;
  scaleAction: "scale-up" | "scale-down" | "hold";
  reason: string;
  decidedAt: string;
};
