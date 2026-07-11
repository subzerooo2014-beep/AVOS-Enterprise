export class RecordDependencyHealthDto {
  serviceName!: string;
  dependencyName!: string;
  endpoint?: string;
  status!: "healthy" | "degraded" | "unavailable" | "unknown";
  latencyMs?: number;
  message?: string;
}
