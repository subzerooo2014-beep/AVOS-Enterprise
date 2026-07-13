export type FederationNodeStatus =
  | "joining"
  | "active"
  | "degraded"
  | "isolated"
  | "retired";

export type FederationNode = {
  id: string;
  name: string;
  region: string;
  capabilities: string[];
  status: FederationNodeStatus;
  load: number;
  lastHeartbeatAt: string;
  createdAt: string;
};

export type FlowRouteDecision = {
  id: string;
  flow: string;
  nodeId: string;
  strategy: "lowest-load" | "regional-affinity" | "capability-match";
  score: number;
  decidedAt: string;
};

export type FlowSimulation = {
  id: string;
  flow: string;
  scenario: string;
  assumptions: Record<string, unknown>;
  result: Record<string, unknown>;
  status: "completed" | "failed";
  executedAt: string;
};

export type FlowControlPlaneCommand = {
  id: string;
  command: string;
  target: string;
  status: "accepted" | "completed" | "failed";
  payload: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
};
