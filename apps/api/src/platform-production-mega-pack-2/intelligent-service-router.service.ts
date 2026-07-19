import { Injectable } from "@nestjs/common";
import {
  MeshRouteDecision,
  MeshServiceInstance,
  RoutingPolicy,
} from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";
import { EnterpriseServiceRegistryService } from "./enterprise-service-registry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { RetryPolicyService } from "./retry-policy.service";

@Injectable()
export class IntelligentServiceRouterService {
  private readonly roundRobinCursor = new Map<string, number>();

  constructor(
    private readonly store: ServiceMeshFileStoreService,
    private readonly registry: EnterpriseServiceRegistryService,
    private readonly circuits: CircuitBreakerService,
    private readonly retries: RetryPolicyService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  configurePolicy(
    input: Omit<RoutingPolicy, "id" | "createdAt">,
  ): RoutingPolicy {
    const policy: RoutingPolicy = {
      ...input,
      id: this.id("routing-policy"),
      createdAt: this.now(),
    };

    this.store.writeJson(
      `routing-policies/${policy.serviceKey}.json`,
      policy,
    );

    return policy;
  }

  getPolicy(serviceKey: string): RoutingPolicy {
    return this.store.readJson<RoutingPolicy>(
      `routing-policies/${serviceKey}.json`,
      {
        id: "routing-policy:default",
        serviceKey,
        strategy: "least-connections",
        requiredTags: [],
        fallbackEnabled: true,
        createdAt: this.now(),
      },
    );
  }

  route(serviceKey: string): MeshRouteDecision {
    const policy = this.getPolicy(serviceKey);
    const retry = this.retries.get(serviceKey);

    if (!this.circuits.canExecute(serviceKey)) {
      return this.saveDecision({
        id: this.id("route-decision"),
        serviceKey,
        strategy: policy.strategy,
        status: "rejected",
        reason: "Circuit breaker is open.",
        attempts: 0,
        createdAt: this.now(),
      });
    }

    const candidates = this.registry.discover(
      serviceKey,
      policy.requiredTags,
    );

    if (candidates.length === 0) {
      this.circuits.recordFailure(serviceKey);

      return this.saveDecision({
        id: this.id("route-decision"),
        serviceKey,
        strategy: policy.strategy,
        status: "unavailable",
        reason: "No healthy service instances discovered.",
        attempts: retry.enabled ? retry.maxAttempts : 1,
        createdAt: this.now(),
      });
    }

    const selected = this.select(candidates, policy);
    this.registry.update(selected.id, {
      currentConnections: selected.currentConnections + 1,
    });
    this.circuits.recordSuccess(serviceKey);

    return this.saveDecision({
      id: this.id("route-decision"),
      serviceKey,
      selectedInstanceId: selected.id,
      strategy: policy.strategy,
      status: "routed",
      reason: `Selected ${selected.serviceName} using ${policy.strategy}.`,
      attempts: 1,
      createdAt: this.now(),
    });
  }

  release(instanceId: string): MeshServiceInstance {
    const instance = this.registry
      .list()
      .find((item) => item.id === instanceId);

    if (!instance) {
      throw new Error(`Service instance not found: ${instanceId}`);
    }

    return this.registry.update(instance.id, {
      currentConnections: Math.max(
        0,
        instance.currentConnections - 1,
      ),
    });
  }

  listDecisions(): MeshRouteDecision[] {
    return this.store.listJson<MeshRouteDecision>("route-decisions");
  }

  private select(
    candidates: MeshServiceInstance[],
    policy: RoutingPolicy,
  ): MeshServiceInstance {
    if (policy.strategy === "round-robin") {
      const cursor = this.roundRobinCursor.get(policy.serviceKey) ?? 0;
      const selected = candidates[cursor % candidates.length];
      this.roundRobinCursor.set(
        policy.serviceKey,
        (cursor + 1) % candidates.length,
      );
      return selected;
    }

    if (policy.strategy === "weighted") {
      return [...candidates].sort(
        (a, b) => b.weight - a.weight,
      )[0];
    }

    if (policy.strategy === "priority") {
      return [...candidates].sort(
        (a, b) => a.priority - b.priority,
      )[0];
    }

    if (policy.strategy === "region-aware" && policy.preferredRegion) {
      const regional = candidates.filter(
        (candidate) => candidate.region === policy.preferredRegion,
      );

      if (regional.length > 0) {
        return [...regional].sort(
          (a, b) => a.currentConnections - b.currentConnections,
        )[0];
      }
    }

    return [...candidates].sort(
      (a, b) =>
        a.currentConnections - b.currentConnections ||
        b.healthScore - a.healthScore ||
        b.weight - a.weight,
    )[0];
  }

  private saveDecision(
    decision: MeshRouteDecision,
  ): MeshRouteDecision {
    this.store.writeJson(
      `route-decisions/${decision.id}.json`,
      decision,
    );
    return decision;
  }
}