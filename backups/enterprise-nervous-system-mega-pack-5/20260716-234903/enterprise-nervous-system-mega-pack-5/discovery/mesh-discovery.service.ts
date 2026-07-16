import { Injectable } from "@nestjs/common";
import { MeshCapabilityEndpoint } from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshRegistryService } from "../registry/mesh-registry.service";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshDiscoveryService {
  constructor(
    private readonly registry: MeshRegistryService,
    private readonly audit: MeshAuditService
  ) {}

  discover(input: {
    capabilityId: string;
    protocol?: MeshCapabilityEndpoint["protocol"];
    zone?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const services = this.registry.listServices();

    const candidates = this.registry.listEndpoints()
      .filter((endpoint) => endpoint.active)
      .filter((endpoint) => endpoint.capabilityId === input.capabilityId)
      .filter(
        (endpoint) =>
          !input.protocol ||
          endpoint.protocol === input.protocol
      )
      .filter((endpoint) => {
        const service = services.find(
          (candidate) => candidate.id === endpoint.serviceId
        );

        return Boolean(
          service &&
          service.status === "active" &&
          (!input.zone || service.zone === input.zone)
        );
      })
      .sort(
        (left, right) =>
          right.priority - left.priority ||
          right.weight - left.weight
      );

    this.audit.record({
      correlationId: input.correlationId,
      category: "discovery",
      action: "mesh-capability-discovered",
      subjectId: input.capabilityId,
      actorIdentityId: input.actorIdentityId,
      outcome: candidates.length > 0 ? "success" : "warning",
      metadata: {
        candidates: candidates.length
      }
    });

    return candidates;
  }
}
