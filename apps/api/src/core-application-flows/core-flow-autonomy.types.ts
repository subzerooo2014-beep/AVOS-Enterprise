export type AutonomousActionStatus =
  | "proposed"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rolled-back";

export type AutonomousAction = {
  id: string;
  flow: string;
  executionId: string;
  action: string;
  rationale: string;
  confidence: number;
  riskScore: number;
  status: AutonomousActionStatus;
  createdAt: string;
  completedAt?: string;
  error?: string;
};

export type FlowExperiment = {
  id: string;
  flow: string;
  hypothesis: string;
  variants: string[];
  status: "draft" | "running" | "completed" | "cancelled";
  winner?: string;
  createdAt: string;
  completedAt?: string;
};

export type FlowBenchmark = {
  id: string;
  flow: string;
  metric: string;
  value: number;
  baseline: number;
  deltaPercent: number;
  recordedAt: string;
};

export type FlowRelease = {
  id: string;
  flow: string;
  version: string;
  status: "draft" | "canary" | "active" | "rolled-back";
  trafficPercent: number;
  createdAt: string;
  activatedAt?: string;
};
