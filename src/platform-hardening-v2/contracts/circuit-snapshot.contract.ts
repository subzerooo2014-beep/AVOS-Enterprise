import { CircuitState } from "../enums/circuit-state.enum";

export interface CircuitSnapshot {
  name: string;
  state: CircuitState;
  failures: number;
  successesInHalfOpen: number;
  openedAt: string | null;
  lastFailureAt: string | null;
  lastSuccessAt: string | null;
  totalExecutions: number;
  totalFailures: number;
  totalSuccesses: number;
  rejectedExecutions: number;
}
