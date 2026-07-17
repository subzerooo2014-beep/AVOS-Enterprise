import { Injectable } from "@nestjs/common";
import { KnowledgeMeshEventService } from "./knowledge-mesh-event.service";
import { KnowledgeMeshObservabilityService } from "./knowledge-mesh-observability.service";
import { KnowledgeMeshPolicyService } from "./knowledge-mesh-policy.service";
import { KnowledgeMeshRegistryService } from "./knowledge-mesh-registry.service";
import { KnowledgeMeshRoutingService } from "./knowledge-mesh-routing.service";

@Injectable()
export class KnowledgeMeshHealthService {
  constructor(
    private readonly registry: KnowledgeMeshRegistryService,
    private readonly routing: KnowledgeMeshRoutingService,
    private readonly policies: KnowledgeMeshPolicyService,
    private readonly events: KnowledgeMeshEventService,
    private readonly observability: KnowledgeMeshObservabilityService,
  ) {}

  status() {
    const counts = this.registry.counts();
    const metrics = this.observability.snapshot();
    return {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-8 Knowledge Mesh",
      status: "operational",
      domains: counts.domains,
      nodes: counts.nodes,
      routes: this.routing.count(),
      policies: this.policies.count(),
      events: this.events.count(),
      metrics,
      checkedAt: new Date().toISOString(),
    };
  }
}