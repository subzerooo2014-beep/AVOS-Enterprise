import { Injectable, ServiceUnavailableException } from "@nestjs/common";

type CircuitState = {
  failures: number;
  successes: number;
  state: "closed" | "open" | "half-open";
  openedAt?: number;
};

@Injectable()
export class CoreFlowCircuitBreakerService {
  private readonly circuits = new Map<string, CircuitState>();

  beforeCall(name: string, resetTimeoutMs = 30_000) {
    const circuit = this.circuits.get(name) ?? {
      failures: 0,
      successes: 0,
      state: "closed" as const,
    };

    if (
      circuit.state === "open" &&
      circuit.openedAt &&
      Date.now() - circuit.openedAt >= resetTimeoutMs
    ) {
      circuit.state = "half-open";
    }

    this.circuits.set(name, circuit);

    if (circuit.state === "open") {
      throw new ServiceUnavailableException(`Circuit '${name}' is open.`);
    }

    return circuit;
  }

  recordSuccess(name: string) {
    const circuit = this.beforeCall(name);
    circuit.successes += 1;
    circuit.failures = 0;
    circuit.state = "closed";
    circuit.openedAt = undefined;
    return circuit;
  }

  recordFailure(name: string, threshold = 5) {
    const circuit = this.circuits.get(name) ?? {
      failures: 0,
      successes: 0,
      state: "closed" as const,
    };
    circuit.failures += 1;
    if (circuit.failures >= threshold) {
      circuit.state = "open";
      circuit.openedAt = Date.now();
    }
    this.circuits.set(name, circuit);
    return circuit;
  }

  dashboard() {
    return Array.from(this.circuits.entries()).map(([name, state]) => ({
      name,
      ...state,
    }));
  }
}
