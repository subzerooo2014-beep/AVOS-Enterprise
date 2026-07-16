import { Injectable } from "@nestjs/common";
import { MeshHealthIndex } from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshRegistryService } from "../registry/mesh-registry.service";
import { MeshRoutingService } from "../routing/mesh-routing.service";
import { MeshCircuitBreakerService } from "../resilience/mesh-circuit-breaker.service";
import { MeshBulkheadService } from "../resilience/mesh-bulkhead.service";
import { MeshCapabilityCommunicationService } from "../capabilities/mesh-capability-communication.service";
import { MeshPolicyService } from "../policies/mesh-policy.service";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshHealthService {
  private readonly indexes = new Map<string, MeshHealthIndex>();

  constructor(
    private readonly registry: MeshRegistryService,
    private readonly routing: MeshRoutingService,
    private readonly circuits: MeshCircuitBreakerService,
    private readonly bulkheads: MeshBulkheadService,
    private readonly communication: MeshCapabilityCommunicationService,
    private readonly policies: MeshPolicyService,
    private readonly audit: MeshAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const registry = this.registry.summary();
    const routing = this.routing.summary();
    const circuits = this.circuits.summary();
    const bulkheads = this.bulkheads.summary();
    const invocations = this.communication.summary();
    const policies = this.policies.summary();

    const registryScore =
      registry.services.total >= 2 &&
      registry.services.degraded === 0 &&
      registry.services.offline === 0 &&
      registry.endpoints.active === registry.endpoints.total
        ? 100
        : 70;

    const discoveryScore =
      registry.endpoints.total >= 2 ? 100 : 70;

    const routingScore =
      routing.total === 0
        ? 100
        : Number(
            (
              routing.selected /
              routing.total *
              100
            ).toFixed(2)
          );

    const circuitScore =
      circuits.open === 0
        ? 100
        : Math.max(0, 100 - circuits.open * 25);

    const bulkheadScore =
      bulkheads.saturated === 0
        ? 100
        : Math.max(0, 100 - bulkheads.saturated * 25);

    const invocationScore =
      invocations.total === 0
        ? 100
        : Number(
            (
              invocations.completed /
              invocations.total *
              100
            ).toFixed(2)
          );

    const policyScore =
      policies.total >= 2 &&
      policies.active === policies.total
        ? 100
        : 70;

    const score = Number(
      (
        registryScore * 0.2 +
        discoveryScore * 0.1 +
        routingScore * 0.15 +
        circuitScore * 0.15 +
        bulkheadScore * 0.1 +
        invocationScore * 0.2 +
        policyScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (registryScore < 90) {
      reasons.push("Service mesh registry health is below target.");
    }

    if (routingScore < 90) {
      reasons.push("Mesh route success is below target.");
    }

    if (circuitScore < 90) {
      reasons.push("One or more circuit breakers are open.");
    }

    if (bulkheadScore < 90) {
      reasons.push("One or more bulkheads are saturated.");
    }

    if (invocationScore < 90) {
      reasons.push("Capability invocation success is below target.");
    }

    if (policyScore < 90) {
      reasons.push("Communication policy coverage is incomplete.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System service mesh core is healthy."
      );
    }

    const index: MeshHealthIndex = {
      id: `mesh-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        registryScore,
        discoveryScore,
        routingScore,
        circuitScore,
        bulkheadScore,
        invocationScore,
        policyScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "mesh-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(score: number): MeshHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
