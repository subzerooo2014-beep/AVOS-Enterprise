export interface TrafficPolicy {
  enabled: boolean;
  requestsPerMinute: number;
  maximumConcurrentRequests: number;
  loadSheddingThresholdPercent: number;
  excludedPaths: string[];
  maintenanceAllowedPaths: string[];
}
