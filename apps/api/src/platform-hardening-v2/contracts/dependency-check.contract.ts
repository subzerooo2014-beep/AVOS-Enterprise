import { DependencyCheckResult } from "../interfaces/dependency-check.interface";

export type DependencyCheckExecutor =
  () => Promise<Omit<DependencyCheckResult, "latencyMs" | "checkedAt">>;

export interface RegisteredDependencyCheck {
  name: string;
  critical: boolean;
  timeoutMs: number;
  executor: DependencyCheckExecutor;
}
