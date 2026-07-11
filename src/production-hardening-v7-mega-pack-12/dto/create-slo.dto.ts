export class CreateSloDto {
  serviceName!: string;
  environment?: string;
  name!: string;
  description?: string;
  targetAvailabilityPercent?: number;
  targetLatencyMs?: number;
  maximumErrorRatePercent?: number;
  measurementWindowMinutes?: number;
}
