import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

export interface ServiceNode {
  id: string;
  name: string;
  endpoint: string;
  healthy: boolean;
  weight: number;
  failures: number;
  circuitOpenUntil: number | null;
  registeredAt: string;
  lastSeenAt: string;
}

@Injectable()
export class EnterpriseServiceMeshService {
  private readonly services = new Map<string, ServiceNode[]>();
  private readonly roundRobin = new Map<string, number>();

  register(input: {
    name: string;
    endpoint: string;
    weight?: number;
  }): ServiceNode {
    const node: ServiceNode = {
      id: randomUUID(),
      name: input.name,
      endpoint: input.endpoint,
      healthy: true,
      weight: Math.max(1, input.weight ?? 1),
      failures: 0,
      circuitOpenUntil: null,
      registeredAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };

    const nodes = this.services.get(input.name) ?? [];
    nodes.push(node);
    this.services.set(input.name, nodes);

    return node;
  }

  discover(name: string): ServiceNode[] {
    return (this.services.get(name) ?? []).map((node) => ({ ...node }));
  }

  resolve(name: string): ServiceNode | null {
    const now = Date.now();
    const candidates = (this.services.get(name) ?? []).filter((node) => {
      const circuitClosed =
        node.circuitOpenUntil === null ||
        node.circuitOpenUntil <= now;

      return node.healthy && circuitClosed;
    });

    if (candidates.length === 0) {
      return null;
    }

    const current = this.roundRobin.get(name) ?? 0;
    const selected = candidates[current % candidates.length];
    this.roundRobin.set(name, current + 1);

    return { ...selected };
  }

  reportSuccess(serviceId: string): void {
    const node = this.findById(serviceId);
    if (!node) return;

    node.failures = 0;
    node.healthy = true;
    node.circuitOpenUntil = null;
    node.lastSeenAt = new Date().toISOString();
  }

  reportFailure(serviceId: string): void {
    const node = this.findById(serviceId);
    if (!node) return;

    node.failures += 1;
    node.lastSeenAt = new Date().toISOString();

    if (node.failures >= 3) {
      node.healthy = false;
      node.circuitOpenUntil = Date.now() + 30_000;
    }
  }

  retryPolicy(): Record<string, unknown> {
    return {
      maxAttempts: 3,
      baseDelayMs: 200,
      strategy: "exponential-backoff",
      jitter: true
    };
  }

  status(): Record<string, unknown> {
    const nodes = [...this.services.values()].flat();
    const healthy = nodes.filter((node) => node.healthy).length;

    return {
      name: "Enterprise Service Mesh",
      status: nodes.length === 0 || healthy === nodes.length
        ? "operational"
        : "degraded",
      registeredServices: this.services.size,
      registeredNodes: nodes.length,
      healthyNodes: healthy,
      circuitBreakers: nodes.map((node) => ({
        serviceId: node.id,
        open: Boolean(
          node.circuitOpenUntil &&
          node.circuitOpenUntil > Date.now()
        ),
        failures: node.failures
      })),
      retryPolicy: this.retryPolicy()
    };
  }

  private findById(id: string): ServiceNode | undefined {
    return [...this.services.values()]
      .flat()
      .find((node) => node.id === id);
  }
}