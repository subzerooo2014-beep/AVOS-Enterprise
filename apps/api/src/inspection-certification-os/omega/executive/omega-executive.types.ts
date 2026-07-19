export interface ExecutiveKpi {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly unit: "count" | "percent" | "score" | "days";
  readonly direction: "up" | "down" | "stable";
  readonly healthy: boolean;
}

export interface HistoricalSnapshot {
  readonly snapshotId: string;
  readonly capturedAt: string;
  readonly readinessScore: number;
  readonly riskScore: number;
  readonly openIssues: number;
  readonly certifiedAssets: number;
  readonly pendingApprovals: number;
}

export interface TrendPoint {
  readonly timestamp: string;
  readonly value: number;
}

export interface TrendSeries {
  readonly metric: string;
  readonly points: readonly TrendPoint[];
  readonly direction: "improving" | "declining" | "stable";
  readonly changePercent: number;
}

export interface DeltaResult {
  readonly baselineSnapshotId: string;
  readonly currentSnapshotId: string;
  readonly readinessDelta: number;
  readonly riskDelta: number;
  readonly openIssuesDelta: number;
  readonly certifiedAssetsDelta: number;
  readonly pendingApprovalsDelta: number;
  readonly overallDirection: "improving" | "declining" | "stable";
}

export interface ExecutiveDashboard {
  readonly generatedAt: string;
  readonly status: "healthy" | "attention-required" | "critical";
  readonly readinessScore: number;
  readonly riskScore: number;
  readonly kpis: readonly ExecutiveKpi[];
  readonly highlights: readonly string[];
  readonly warnings: readonly string[];
  readonly humanFinalAuthority: true;
}
