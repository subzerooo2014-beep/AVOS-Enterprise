import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CircuitSnapshot } from "../contracts/circuit-snapshot.contract";
import { CircuitState } from "../enums/circuit-state.enum";
import { CircuitBreakerOptions } from "../interfaces/circuit-breaker-options.interface";
import { withTimeout } from "../utils/with-timeout.util";

interface InternalCircuit {
  name: string;
  state: CircuitState;
  failures: number;
  successesInHalfOpen: number;
  openedAt: number | null;
  lastFailureAt: number | null;
  lastSuccessAt: number | null;
  totalExecutions: number;
  totalFailures: number;
  totalSuccesses: number;
  rejectedExecutions: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, InternalCircuit>();

  async execute<T>(
    circuitName: string,
    operation: () => Promise<T>,
    options: CircuitBreakerOptions = {},
  ): Promise<T> {
    const configuration = {
      failureThreshold: this.normalizeInteger(
        options.failureThreshold,
        5,
        1,
        100,
      ),
      successThreshold: this.normalizeInteger(
        options.successThreshold,
        2,
        1,
        100,
      ),
      openDurationMs: this.normalizeInteger(
        options.openDurationMs,
        30_000,
        1_000,
        3_600_000,
      ),
      executionTimeoutMs: this.normalizeInteger(
        options.executionTimeoutMs,
        10_000,
        100,
        600_000,
      ),
    };

    const circuit = this.getOrCreateCircuit(circuitName);

    this.refreshOpenCircuit(circuit, configuration.openDurationMs);

    if (circuit.state === CircuitState.OPEN) {
      circuit.rejectedExecutions += 1;

      throw new ServiceUnavailableException({
        success: false,
        code: "CIRCUIT_OPEN",
        message: `Circuit ${circuitName} is temporarily open`,
        circuit: this.toSnapshot(circuit),
      });
    }

    circuit.totalExecutions += 1;

    try {
      const result = await withTimeout(
        operation(),
        configuration.executionTimeoutMs,
        `circuit:${circuitName}`,
      );

      this.recordSuccess(
        circuit,
        configuration.successThreshold,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        circuit,
        configuration.failureThreshold,
      );

      throw error;
    }
  }

  getSnapshot(circuitName: string): CircuitSnapshot | null {
    const circuit = this.circuits.get(circuitName);

    return circuit ? this.toSnapshot(circuit) : null;
  }

  getAllSnapshots(): CircuitSnapshot[] {
    return Array.from(this.circuits.values())
      .map((circuit) => this.toSnapshot(circuit))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  reset(circuitName: string): CircuitSnapshot {
    const circuit = this.getOrCreateCircuit(circuitName);

    circuit.state = CircuitState.CLOSED;
    circuit.failures = 0;
    circuit.successesInHalfOpen = 0;
    circuit.openedAt = null;

    this.logger.log(`Circuit ${circuitName} was manually reset`);

    return this.toSnapshot(circuit);
  }

  private getOrCreateCircuit(name: string): InternalCircuit {
    const existing = this.circuits.get(name);

    if (existing) {
      return existing;
    }

    const created: InternalCircuit = {
      name,
      state: CircuitState.CLOSED,
      failures: 0,
      successesInHalfOpen: 0,
      openedAt: null,
      lastFailureAt: null,
      lastSuccessAt: null,
      totalExecutions: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      rejectedExecutions: 0,
    };

    this.circuits.set(name, created);

    return created;
  }

  private refreshOpenCircuit(
    circuit: InternalCircuit,
    openDurationMs: number,
  ): void {
    if (
      circuit.state !== CircuitState.OPEN ||
      circuit.openedAt === null
    ) {
      return;
    }

    if (Date.now() - circuit.openedAt >= openDurationMs) {
      circuit.state = CircuitState.HALF_OPEN;
      circuit.successesInHalfOpen = 0;

      this.logger.warn(
        `Circuit ${circuit.name} moved from OPEN to HALF_OPEN`,
      );
    }
  }

  private recordSuccess(
    circuit: InternalCircuit,
    successThreshold: number,
  ): void {
    circuit.lastSuccessAt = Date.now();
    circuit.totalSuccesses += 1;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successesInHalfOpen += 1;

      if (circuit.successesInHalfOpen >= successThreshold) {
        circuit.state = CircuitState.CLOSED;
        circuit.failures = 0;
        circuit.successesInHalfOpen = 0;
        circuit.openedAt = null;

        this.logger.log(
          `Circuit ${circuit.name} recovered and moved to CLOSED`,
        );
      }

      return;
    }

    circuit.failures = 0;
  }

  private recordFailure(
    circuit: InternalCircuit,
    failureThreshold: number,
  ): void {
    circuit.failures += 1;
    circuit.totalFailures += 1;
    circuit.lastFailureAt = Date.now();

    if (
      circuit.state === CircuitState.HALF_OPEN ||
      circuit.failures >= failureThreshold
    ) {
      circuit.state = CircuitState.OPEN;
      circuit.openedAt = Date.now();
      circuit.successesInHalfOpen = 0;

      this.logger.error(
        `Circuit ${circuit.name} moved to OPEN after failure`,
      );
    }
  }

  private toSnapshot(circuit: InternalCircuit): CircuitSnapshot {
    return {
      name: circuit.name,
      state: circuit.state,
      failures: circuit.failures,
      successesInHalfOpen: circuit.successesInHalfOpen,
      openedAt: this.toIsoDate(circuit.openedAt),
      lastFailureAt: this.toIsoDate(circuit.lastFailureAt),
      lastSuccessAt: this.toIsoDate(circuit.lastSuccessAt),
      totalExecutions: circuit.totalExecutions,
      totalFailures: circuit.totalFailures,
      totalSuccesses: circuit.totalSuccesses,
      rejectedExecutions: circuit.rejectedExecutions,
    };
  }

  private toIsoDate(value: number | null): string | null {
    return value === null ? null : new Date(value).toISOString();
  }

  private normalizeInteger(
    value: number | undefined,
    fallback: number,
    minimum: number,
    maximum: number,
  ): number {
    if (!Number.isFinite(value)) {
      return fallback;
    }

    return Math.min(
      maximum,
      Math.max(minimum, Math.floor(value as number)),
    );
  }
}
