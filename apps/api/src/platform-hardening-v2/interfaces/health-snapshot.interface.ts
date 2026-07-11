import { ReadinessState } from "../enums/readiness-state.enum";
import { DependencyCheckResult } from "./dependency-check.interface";

export interface HealthSnapshot {
  system: string;
  version: string;
  environment: string;
  state: ReadinessState;
  ready: boolean;
  live: boolean;
  timestamp: string;
  uptimeSeconds: number;
  dependencies: DependencyCheckResult[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    unknown: number;
    criticalFailures: number;
  };
}
