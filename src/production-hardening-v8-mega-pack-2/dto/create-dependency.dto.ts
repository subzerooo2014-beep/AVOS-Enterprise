export class CreateDependencyDto {
  targetName!: string;
  dependencyType!:
    | "database"
    | "cache"
    | "queue"
    | "api"
    | "storage"
    | "identity"
    | "network"
    | "external";
  critical?: boolean;
  status?: "available" | "degraded" | "unavailable";
  latencyMs?: number;
  errorRatePercent?: number;
}
