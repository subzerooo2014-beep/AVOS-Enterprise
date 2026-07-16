import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MeshCircuitBreaker,
  MeshCircuitState
} from "../enterprise-nervous-system-mega-pack-5.types";

@Injectable()
export class MeshCircuitBreakerService {
  private readonly circuits =
    new Map<string, MeshCircuitBreaker>();

  get(endpointId: string) {
    const existing = this.circuits.get(endpointId);

    if (existing) {
      return this.refresh(existing);
    }

    const circuit: MeshCircuitBreaker = {
      id: `mesh-circuit:${endpointId}`,
      endpointId,
      state: "closed",
      failureCount: 0,
      successCount: 0,
      updatedAt: new Date().toISOString()
    };

    this.circuits.set(endpointId, circuit);
    return circuit;
  }

  assertAvailable(
    endpointId: string,
    resetMs: number
  ) {
    const circuit = this.get(endpointId);

    if (
      circuit.state === "open" &&
      circuit.openedAt &&
      Date.now() - new Date(circuit.openedAt).getTime() < resetMs
    ) {
      throw new ConflictException(
        `Circuit breaker is open for endpoint: ${endpointId}`
      );
    }

    return circuit;
  }

  recordSuccess(endpointId: string) {
    const current = this.get(endpointId);

    const updated: MeshCircuitBreaker = {
      ...current,
      state: "closed",
      failureCount: 0,
      successCount: current.successCount + 1,
      openedAt: undefined,
      lastSuccessAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.circuits.set(endpointId, updated);
    return updated;
  }

  recordFailure(
    endpointId: string,
    threshold: number
  ) {
    const current = this.get(endpointId);
    const failures = current.failureCount + 1;
    const state: MeshCircuitState =
      failures >= threshold ? "open" : current.state;

    const updated: MeshCircuitBreaker = {
      ...current,
      state,
      failureCount: failures,
      openedAt:
        state === "open"
          ? current.openedAt ?? new Date().toISOString()
          : current.openedAt,
      lastFailureAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.circuits.set(endpointId, updated);
    return updated;
  }

  list() {
    return Array.from(this.circuits.values()).map((item) => this.refresh(item));
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      closed: items.filter((x) => x.state === "closed").length,
      open: items.filter((x) => x.state === "open").length,
      halfOpen: items.filter((x) => x.state === "half-open").length
    };
  }

  private refresh(circuit: MeshCircuitBreaker) {
    return circuit;
  }
}
