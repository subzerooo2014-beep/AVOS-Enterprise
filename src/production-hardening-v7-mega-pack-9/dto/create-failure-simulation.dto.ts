export class CreateFailureSimulationDto {
  profileId!: string;
  name!: string;
  failureType!:
    | "latency"
    | "dependency_failure"
    | "resource_exhaustion"
    | "service_unavailable"
    | "data_corruption";
  target!: string;
  severity!: "low" | "medium" | "high" | "critical";
  durationSeconds?: number;
}
