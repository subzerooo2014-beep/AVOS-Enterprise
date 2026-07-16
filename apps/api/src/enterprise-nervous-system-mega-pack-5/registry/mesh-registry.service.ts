import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MeshCapabilityEndpoint,
  MeshServiceRecord
} from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshRegistryService {
  private readonly services = new Map<string, MeshServiceRecord>();
  private readonly endpoints = new Map<string, MeshCapabilityEndpoint>();

  constructor(private readonly audit: MeshAuditService) {
    this.seed();
  }

  listServices() {
    return Array.from(this.services.values());
  }

  listEndpoints() {
    return Array.from(this.endpoints.values());
  }

  getService(id: string) {
    const service = this.services.get(id);

    if (!service) {
      throw new NotFoundException(`Mesh service not found: ${id}`);
    }

    return service;
  }

  getEndpoint(id: string) {
    const endpoint = this.endpoints.get(id);

    if (!endpoint) {
      throw new NotFoundException(`Mesh endpoint not found: ${id}`);
    }

    return endpoint;
  }

  registerService(
    input: Omit<MeshServiceRecord, "createdAt" | "updatedAt">,
    context: { actorIdentityId: string; correlationId: string }
  ) {
    if (this.services.has(input.id)) {
      throw new ConflictException(`Mesh service already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const service: MeshServiceRecord = {
      ...input,
      capabilityIds: Array.from(new Set(input.capabilityIds)),
      endpointIds: Array.from(new Set(input.endpointIds)),
      tags: Array.from(new Set(input.tags)),
      instanceCount: Math.max(1, input.instanceCount),
      createdAt: now,
      updatedAt: now
    };

    this.services.set(service.id, service);

    this.audit.record({
      correlationId: context.correlationId,
      category: "service",
      action: "mesh-service-registered",
      subjectId: service.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: service.version,
        capabilities: service.capabilityIds.length
      }
    });

    return service;
  }

  registerEndpoint(
    input: Omit<MeshCapabilityEndpoint, "createdAt" | "updatedAt">,
    context: { actorIdentityId: string; correlationId: string }
  ) {
    if (this.endpoints.has(input.id)) {
      throw new ConflictException(`Mesh endpoint already exists: ${input.id}`);
    }

    const service = this.getService(input.serviceId);
    const now = new Date().toISOString();

    const endpoint: MeshCapabilityEndpoint = {
      ...input,
      timeoutMs: Math.max(100, input.timeoutMs),
      permissions: Array.from(new Set(input.permissions)),
      weight: Math.max(1, input.weight),
      priority: Math.max(0, input.priority),
      createdAt: now,
      updatedAt: now
    };

    this.endpoints.set(endpoint.id, endpoint);

    const updatedService: MeshServiceRecord = {
      ...service,
      capabilityIds: Array.from(new Set([
        ...service.capabilityIds,
        endpoint.capabilityId
      ])),
      endpointIds: Array.from(new Set([
        ...service.endpointIds,
        endpoint.id
      ])),
      updatedAt: now
    };

    this.services.set(updatedService.id, updatedService);

    this.audit.record({
      correlationId: context.correlationId,
      category: "endpoint",
      action: "mesh-capability-endpoint-registered",
      subjectId: endpoint.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        serviceId: endpoint.serviceId,
        capabilityId: endpoint.capabilityId
      }
    });

    return endpoint;
  }

  summary() {
    const services = this.listServices();
    const endpoints = this.listEndpoints();

    return {
      services: {
        total: services.length,
        active: services.filter((x) => x.status === "active").length,
        degraded: services.filter((x) => x.status === "degraded").length,
        offline: services.filter((x) => x.status === "offline").length
      },
      endpoints: {
        total: endpoints.length,
        active: endpoints.filter((x) => x.active).length,
        approvalRequired:
          endpoints.filter((x) => x.requiresHumanApproval).length
      }
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const services: MeshServiceRecord[] = [
      {
        id: "mesh-service:enterprise-kernel",
        name: "Enterprise Kernel",
        version: "1.0.0",
        domain: "kernel",
        status: "active",
        capabilityIds: [
          "kernel.health",
          "kernel.module-lifecycle"
        ],
        endpointIds: [],
        tags: ["core", "kernel"],
        zone: "core",
        instanceCount: 1,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "mesh-service:enterprise-brain",
        name: "Enterprise Brain",
        version: "1.0.0",
        domain: "brain",
        status: "active",
        capabilityIds: [
          "brain.decision",
          "brain.reasoning"
        ],
        endpointIds: [],
        tags: ["core", "brain"],
        zone: "intelligence",
        instanceCount: 1,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const service of services) {
      this.services.set(service.id, service);
    }

    const endpoints: MeshCapabilityEndpoint[] = [
      {
        id: "mesh-endpoint:kernel-health",
        serviceId: "mesh-service:enterprise-kernel",
        capabilityId: "kernel.health",
        name: "Kernel Health Endpoint",
        protocol: "internal",
        address: "kernel://health",
        timeoutMs: 5000,
        requiresAuthentication: true,
        requiresHumanApproval: false,
        permissions: ["kernel.health.read"],
        active: true,
        weight: 100,
        priority: 100,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "mesh-endpoint:brain-decision",
        serviceId: "mesh-service:enterprise-brain",
        capabilityId: "brain.decision",
        name: "Brain Decision Endpoint",
        protocol: "internal",
        address: "brain://decision",
        timeoutMs: 15000,
        requiresAuthentication: true,
        requiresHumanApproval: true,
        permissions: ["brain.decision.execute"],
        active: true,
        weight: 100,
        priority: 100,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const endpoint of endpoints) {
      this.endpoints.set(endpoint.id, endpoint);

      const service = this.services.get(endpoint.serviceId);

      if (service) {
        this.services.set(service.id, {
          ...service,
          endpointIds: Array.from(new Set([
            ...service.endpointIds,
            endpoint.id
          ]))
        });
      }
    }
  }
}
