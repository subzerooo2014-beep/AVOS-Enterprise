export type TelemetrySignalType = "metric" | "trace" | "log" | "alert";

export type TelemetrySignal = {
  id: string;
  executionId?: string;
  flow: string;
  type: TelemetrySignalType;
  name: string;
  value?: number;
  severity?: "info" | "warning" | "critical";
  attributes: Record<string, unknown>;
  createdAt: string;
};

export type FlowServiceObjective = {
  id: string;
  flow: string;
  metric: string;
  target: number;
  windowMinutes: number;
  status: "healthy" | "warning" | "breached";
  createdAt: string;
};

export type TraceSpan = {
  id: string;
  traceId: string;
  parentSpanId?: string;
  executionId?: string;
  flow: string;
  operation: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  status: "running" | "completed" | "failed";
};
