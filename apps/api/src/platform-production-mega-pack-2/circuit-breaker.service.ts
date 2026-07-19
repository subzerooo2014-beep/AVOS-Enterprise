import { Injectable } from "@nestjs/common";
import { CircuitBreakerState } from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";

@Injectable()
export class CircuitBreakerService {
  constructor(
    private readonly store: ServiceMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private initial(serviceKey: string): CircuitBreakerState {
    return {
      id: `circuit:${serviceKey}`,
      serviceKey,
      state: "closed",
      failureCount: 0,
      successCount: 0,
      failureThreshold: 5,
      recoveryTimeoutMs: 30000,
      updatedAt: this.now(),
    };
  }

  get(serviceKey: string): CircuitBreakerState {
    return this.store.readJson<CircuitBreakerState>(
      `circuits/${serviceKey}.json`,
      this.initial(serviceKey),
    );
  }

  canExecute(serviceKey: string): boolean {
    const circuit = this.get(serviceKey);

    if (circuit.state === "closed" || circuit.state === "half-open") {
      return true;
    }

    if (
      circuit.openedAt &&
      Date.now() - new Date(circuit.openedAt).getTime() >=
        circuit.recoveryTimeoutMs
    ) {
      this.save({
        ...circuit,
        state: "half-open",
        updatedAt: this.now(),
      });

      return true;
    }

    return false;
  }

  recordSuccess(serviceKey: string): CircuitBreakerState {
    const circuit = this.get(serviceKey);

    return this.save({
      ...circuit,
      state: "closed",
      successCount: circuit.successCount + 1,
      failureCount: 0,
      openedAt: undefined,
      updatedAt: this.now(),
    });
  }

  recordFailure(serviceKey: string): CircuitBreakerState {
    const circuit = this.get(serviceKey);
    const failureCount = circuit.failureCount + 1;
    const shouldOpen = failureCount >= circuit.failureThreshold;

    return this.save({
      ...circuit,
      state: shouldOpen ? "open" : circuit.state,
      failureCount,
      openedAt: shouldOpen ? this.now() : circuit.openedAt,
      updatedAt: this.now(),
    });
  }

  configure(
    serviceKey: string,
    failureThreshold: number,
    recoveryTimeoutMs: number,
  ): CircuitBreakerState {
    const current = this.get(serviceKey);

    return this.save({
      ...current,
      failureThreshold: Math.max(1, failureThreshold),
      recoveryTimeoutMs: Math.max(1000, recoveryTimeoutMs),
      updatedAt: this.now(),
    });
  }

  private save(state: CircuitBreakerState): CircuitBreakerState {
    this.store.writeJson(`circuits/${state.serviceKey}.json`, state);
    return state;
  }
}