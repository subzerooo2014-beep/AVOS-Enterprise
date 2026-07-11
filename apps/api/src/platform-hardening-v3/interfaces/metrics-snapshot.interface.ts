export interface MetricsSnapshot {
  generatedAt: string;
  startedAt: string;
  uptimeSeconds: number;
  totals: {
    requests: number;
    successfulRequests: number;
    failedRequests: number;
    slowRequests: number;
  };
  rates: {
    errorRatePercent: number;
    slowRequestRatePercent: number;
  };
  latency: {
    averageMs: number;
    maximumMs: number;
    minimumMs: number;
  };
  statusCodes: Record<string, number>;
  methods: Record<string, number>;
  paths: Array<{
    path: string;
    requests: number;
    failures: number;
    averageDurationMs: number;
    maximumDurationMs: number;
  }>;
}
