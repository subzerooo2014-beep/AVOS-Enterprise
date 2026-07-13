export type RuntimeFlowStatus = "registered" | "active" | "degraded" | "paused" | "retired";

export type RuntimeFlowRegistration = {
  id: string;
  flow: string;
  version: string;
  owner: string;
  region: string;
  capabilities: string[];
  status: RuntimeFlowStatus;
  createdAt: string;
  updatedAt: string;
};

export type RuntimeCoordinationRecord = {
  id: string;
  executionId: string;
  sourceFlow: string;
  targetFlows: string[];
  status: "planned" | "executing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
};

export type RuntimeFinalizationRecord = {
  id: string;
  scope: string;
  version: string;
  qualityScore: number;
  healthStatus: "healthy" | "degraded" | "unhealthy";
  certification: "pending" | "certified" | "rejected";
  finalizedAt: string;
};
