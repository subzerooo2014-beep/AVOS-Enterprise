export type DataAssetType =
  | "TABLE"
  | "STREAM"
  | "FILE"
  | "API"
  | "MODEL"
  | "REPORT";

export interface DataAssetRecord {
  id: string;
  name: string;
  domain: string;
  type: DataAssetType;
  owner: string;
  version: number;
  schema: Record<string, string>;
  tags: string[];
  status: "ACTIVE" | "DEPRECATED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface DataLineageRecord {
  id: string;
  sourceAssetId: string;
  targetAssetId: string;
  transformation: string;
  createdAt: string;
}

export interface DataQualityRuleRecord {
  id: string;
  assetId: string;
  name: string;
  type: "REQUIRED" | "UNIQUE" | "RANGE" | "PATTERN" | "CUSTOM";
  field?: string;
  configuration: Record<string, unknown>;
  enabled: boolean;
}

export interface DataQualityResultRecord {
  id: string;
  ruleId: string;
  assetId: string;
  passed: boolean;
  score: number;
  message: string;
  checkedAt: string;
}

export interface EtlPipelineRecord {
  id: string;
  name: string;
  sourceAssetId: string;
  targetAssetId: string;
  steps: string[];
  status: "DRAFT" | "ACTIVE" | "PAUSED";
  version: number;
}

export interface EtlExecutionRecord {
  id: string;
  pipelineId: string;
  status: "STARTED" | "COMPLETED" | "FAILED";
  recordsRead: number;
  recordsWritten: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface TimeSeriesPointRecord {
  metric: string;
  timestamp: string;
  value: number;
  labels: Record<string, string>;
}

export interface DataEventRecord {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface DataFoundationMetrics {
  assets: number;
  lineageLinks: number;
  qualityRules: number;
  qualityChecks: number;
  qualityFailures: number;
  pipelines: number;
  executions: number;
  failedExecutions: number;
  timeSeriesPoints: number;
  events: number;
}

export interface DataFoundationHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: DataFoundationMetrics;
  components: Record<string, string>;
}
