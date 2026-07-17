import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMeshConsistencyService } from "./knowledge-mesh-consistency.service";
import { KnowledgeMeshEventService } from "./knowledge-mesh-event.service";
import { KnowledgeMeshObservabilityService } from "./knowledge-mesh-observability.service";
import { KnowledgeMeshPolicyService } from "./knowledge-mesh-policy.service";
import { KnowledgeMeshRegistryService } from "./knowledge-mesh-registry.service";
import { KnowledgeMeshRoutingService } from "./knowledge-mesh-routing.service";
import { KnowledgeMeshRequest, KnowledgeMeshResponse } from "./knowledge-mesh.types";

@Injectable()
export class KnowledgeMeshRuntimeService {
  constructor(
    private readonly registry: KnowledgeMeshRegistryService,
    private readonly routing: KnowledgeMeshRoutingService,
    private readonly policies: KnowledgeMeshPolicyService,
    private readonly consistency: KnowledgeMeshConsistencyService,
    private readonly events: KnowledgeMeshEventService,
    private readonly observability: KnowledgeMeshObservabilityService,
  ) {}

  execute(input: Omit<KnowledgeMeshRequest, "id" | "requestedAt">): KnowledgeMeshResponse {
    const request: KnowledgeMeshRequest = { ...input, id: randomUUID(), requestedAt: new Date().toISOString() };
    const route = this.routing.select(request.namespace);
    const targetDomainId = request.targetDomainId ?? route?.domainId;
    const targetDomain = targetDomainId ? this.registry.getDomain(targetDomainId) : undefined;
    const policyAllowed = this.policies.allows({ ...request, targetDomainId });
    const consistency = targetDomain
      ? this.consistency.evaluate(targetDomain, request.operation)
      : { allowed: false, consistency: "EVENTUAL" as const, domainState: "OFFLINE", evaluatedAt: new Date().toISOString() };
    const accepted = Boolean(route && targetDomain && policyAllowed && consistency.allowed);
    const reason = !route
      ? "No mesh route was found"
      : !targetDomain
        ? "Target mesh domain was not found"
        : !policyAllowed
          ? "Knowledge mesh sharing policy denied the request"
          : !consistency.allowed
            ? "Target domain consistency or state denied the request"
            : "Knowledge mesh request accepted";

    const response: KnowledgeMeshResponse = {
      requestId: request.id,
      routeId: route?.id,
      nodeId: route?.nodeId,
      accepted,
      reason,
      consistency: consistency.consistency,
      completedAt: new Date().toISOString(),
    };

    this.events.emit("knowledge.mesh.request.completed", { requestId: request.id, accepted, routeId: route?.id ?? null });
    this.observability.record({ accepted, routeFound: Boolean(route) });
    return response;
  }
}