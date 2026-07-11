export class StartConfigurationRolloutDto {
  strategy?: "immediate" | "progressive" | "canary";
  targetPercentage?: number;
  healthThresholdPercent?: number;
  requestedBy?: string;
}
