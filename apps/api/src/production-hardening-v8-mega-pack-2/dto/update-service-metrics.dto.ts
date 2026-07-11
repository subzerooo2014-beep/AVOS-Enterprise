export class UpdateServiceMetricsDto {
  requestRate?: number;
  latencyMs!: number;
  errorRatePercent!: number;
  healthScore!: number;
}
