import { Injectable } from "@nestjs/common";

export type PublisherCircuitState =
  | "closed"
  | "open"
  | "half-open";

interface PublisherCircuitRecord {
  channel: string;
  state: PublisherCircuitState;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  openedAt?: Date;
  lastFailureAt?: Date;
  lastSuccessAt?: Date;
  halfOpenProbeActive: boolean;
}

export interface PublisherCircuitSnapshot {
  channel: string;
  state: PublisherCircuitState;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  openedAt?: Date;
  lastFailureAt?: Date;
  lastSuccessAt?: Date;
}

@Injectable()
export class PublisherCircuitBreakerService {
  private readonly failureThreshold =
    this.readPositiveInteger(
      process.env.PUBLISHER_CIRCUIT_FAILURE_THRESHOLD,
      5,
    );

  private readonly successThreshold =
    this.readPositiveInteger(
      process.env.PUBLISHER_CIRCUIT_SUCCESS_THRESHOLD,
      2,
    );

  private readonly openDurationMs =
    this.readPositiveInteger(
      process.env.PUBLISHER_CIRCUIT_OPEN_MS,
      60_000,
    );

  private readonly circuits = new Map<
    string,
    PublisherCircuitRecord
  >();

  canExecute(channel: string): boolean {
    const circuit = this.getOrCreate(channel);

    if (circuit.state === "closed") {
      return true;
    }

    if (circuit.state === "open") {
      const openedAt = circuit.openedAt?.getTime() ?? 0;

      if (
        Date.now() - openedAt <
        this.openDurationMs
      ) {
        return false;
      }

      circuit.state = "half-open";
      circuit.halfOpenProbeActive = false;
      circuit.consecutiveSuccesses = 0;
    }

    if (circuit.halfOpenProbeActive) {
      return false;
    }

    circuit.halfOpenProbeActive = true;
    return true;
  }

  recordSuccess(channel: string): void {
    const circuit = this.getOrCreate(channel);

    circuit.lastSuccessAt = new Date();
    circuit.consecutiveFailures = 0;

    if (circuit.state === "half-open") {
      circuit.consecutiveSuccesses += 1;
      circuit.halfOpenProbeActive = false;

      if (
        circuit.consecutiveSuccesses >=
        this.successThreshold
      ) {
        circuit.state = "closed";
        circuit.openedAt = undefined;
        circuit.consecutiveSuccesses = 0;
      }

      return;
    }

    circuit.state = "closed";
    circuit.consecutiveSuccesses += 1;
  }

  recordFailure(channel: string): void {
    const circuit = this.getOrCreate(channel);

    circuit.lastFailureAt = new Date();
    circuit.consecutiveFailures += 1;
    circuit.consecutiveSuccesses = 0;
    circuit.halfOpenProbeActive = false;

    if (
      circuit.state === "half-open" ||
      circuit.consecutiveFailures >=
        this.failureThreshold
    ) {
      circuit.state = "open";
      circuit.openedAt = new Date();
    }
  }

  forceOpen(channel: string): void {
    const circuit = this.getOrCreate(channel);

    circuit.state = "open";
    circuit.openedAt = new Date();
    circuit.halfOpenProbeActive = false;
  }

  reset(channel: string): void {
    this.circuits.delete(this.normalize(channel));
  }

  snapshot(): PublisherCircuitSnapshot[] {
    return Array.from(this.circuits.values())
      .sort((left, right) =>
        left.channel.localeCompare(right.channel),
      )
      .map((circuit) => ({
        channel: circuit.channel,
        state: circuit.state,
        consecutiveFailures:
          circuit.consecutiveFailures,
        consecutiveSuccesses:
          circuit.consecutiveSuccesses,
        openedAt: circuit.openedAt,
        lastFailureAt: circuit.lastFailureAt,
        lastSuccessAt: circuit.lastSuccessAt,
      }));
  }

  private getOrCreate(
    channel: string,
  ): PublisherCircuitRecord {
    const normalized = this.normalize(channel);
    const existing = this.circuits.get(normalized);

    if (existing) {
      return existing;
    }

    const created: PublisherCircuitRecord = {
      channel: normalized,
      state: "closed",
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      halfOpenProbeActive: false,
    };

    this.circuits.set(normalized, created);

    return created;
  }

  private normalize(channel: string): string {
    return String(channel || "unknown")
      .trim()
      .toLowerCase();
  }

  private readPositiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric = Number(value);

    return Number.isInteger(numeric) && numeric > 0
      ? numeric
      : fallback;
  }
}
