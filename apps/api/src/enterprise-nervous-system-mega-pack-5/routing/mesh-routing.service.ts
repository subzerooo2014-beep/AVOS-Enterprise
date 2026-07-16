import { Injectable } from "@nestjs/common";
import { MeshRouteDecision } from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshDiscoveryService } from "../discovery/mesh-discovery.service";
import { MeshCircuitBreakerService } from "../resilience/mesh-circuit-breaker.service";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshRoutingService {
  private readonly decisions =
    new Map<string, MeshRouteDecision>();

  constructor(
    private readonly discovery: MeshDiscoveryService,
    private readonly circuits: MeshCircuitBreakerService,
    private readonly audit: MeshAuditService
  ) {}

  route(input: {
    capabilityId: string;
    protocol?: "http" | "https" | "grpc" | "event" | "internal";
    zone?: string;
    humanApproved: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const candidates = this.discovery.discover({
      capabilityId: input.capabilityId,
      protocol: input.protocol,
      zone: input.zone,
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId
    });

    const available = candidates.filter(
      (endpoint) =>
        this.circuits.get(endpoint.id).state !== "open"
    );

    const approvalRequired = available.find(
      (endpoint) =>
        endpoint.requiresHumanApproval &&
        !input.humanApproved
    );

    const selected =
      approvalRequired
        ? undefined
        : available[0];

    const decision: MeshRouteDecision = {
      id: `mesh-route:${Date.now()}:${this.decisions.size + 1}`,
      capabilityId: input.capabilityId,
      selectedEndpointId: selected?.id,
      candidateEndpointIds: candidates.map((item) => item.id),
      decision:
        candidates.length === 0
          ? "unavailable"
          : approvalRequired
            ? "approval-required"
            : selected
              ? "selected"
              : "blocked",
      reasons:
        candidates.length === 0
          ? ["No endpoint exposes the requested capability."]
          : approvalRequired
            ? ["Selected capability requires human approval."]
            : selected
              ? ["Endpoint selected by priority, weight, and availability."]
              : ["All candidate circuits are unavailable."],
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.decisions.set(decision.id, decision);

    this.audit.record({
      correlationId: input.correlationId,
      category: "routing",
      action: "mesh-route-decided",
      subjectId: decision.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        decision.decision === "selected"
          ? "success"
          : decision.decision === "approval-required"
            ? "warning"
            : "blocked",
      metadata: {
        selectedEndpointId: decision.selectedEndpointId,
        candidates: decision.candidateEndpointIds.length
      }
    });

    return decision;
  }

  list() {
    return Array.from(this.decisions.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      selected: items.filter((x) => x.decision === "selected").length,
      blocked: items.filter((x) => x.decision === "blocked").length,
      unavailable: items.filter((x) => x.decision === "unavailable").length,
      approvalRequired:
        items.filter((x) => x.decision === "approval-required").length
    };
  }
}
