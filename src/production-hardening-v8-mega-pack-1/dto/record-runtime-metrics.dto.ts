export class RecordRuntimeMetricsDto {
  cpuPercent!: number;
  memoryPercent!: number;
  latencyMs!: number;
  errorRatePercent!: number;
  requestRate?: number;
  activeConnections?: number;
  queueDepth?: number;
}
