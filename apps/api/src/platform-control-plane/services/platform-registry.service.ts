import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type {
  PlatformResource,
  PlatformResourceKind,
  PlatformResourceStatus
} from "../contracts/platform-control-plane.contracts";
import type { RegisterPlatformResourceDto } from "../dto/platform-control-plane.dto";
import { PlatformAuditService } from "./platform-audit.service";
import { PlatformEnvironmentService } from "./platform-environment.service";
import { PlatformIdService } from "./platform-id.service";

@Injectable()
export class PlatformRegistryService {
  private readonly resources = new Map<string, PlatformResource>();

  constructor(
    private readonly ids: PlatformIdService,
    private readonly environments: PlatformEnvironmentService,
    private readonly audit: PlatformAuditService
  ) {
    this.seedFoundation();
  }

  private seedFoundation(): void {
    const development =
      this.environments.findByKind("development") ??
      this.environments.list()[0];

    const resources: RegisterPlatformResourceDto[] = [
      {
        id: "enterprise-kernel",
        name: "AVOS Enterprise Kernel",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: [],
        endpoints: [],
        tags: ["foundation", "kernel"]
      },
      {
        id: "capability-fabric",
        name: "AVOS Capability Fabric",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: ["enterprise-kernel"],
        endpoints: [],
        tags: ["foundation", "capabilities"]
      },
      {
        id: "knowledge-fabric",
        name: "AVOS Knowledge Fabric",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: ["enterprise-kernel"],
        endpoints: [],
        tags: ["foundation", "knowledge"]
      },
      {
        id: "enterprise-decision-intelligence",
        name: "AVOS Enterprise Decision Intelligence",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: ["knowledge-fabric"],
        endpoints: [],
        tags: ["foundation", "decisions"]
      },
      {
        id: "autonomous-orchestration",
        name: "AVOS Autonomous Orchestration",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: [
          "capability-fabric",
          "enterprise-decision-intelligence"
        ],
        endpoints: [],
        tags: ["foundation", "orchestration"]
      },
      {
        id: "enterprise-nervous-system",
        name: "AVOS Enterprise Nervous System",
        kind: "engine",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: ["enterprise-kernel"],
        endpoints: [],
        tags: ["foundation", "events"]
      },
      {
        id: "enterprise-intelligence-mesh",
        name: "AVOS Enterprise Intelligence Mesh",
        kind: "platform",
        version: "1.0.0",
        environmentId: development.id,
        status: "running",
        owner: "AVOS",
        dependencies: [
          "enterprise-kernel",
          "capability-fabric",
          "knowledge-fabric",
          "enterprise-decision-intelligence",
          "autonomous-orchestration",
          "enterprise-nervous-system"
        ],
        endpoints: [
          "/avos/enterprise-intelligence-mesh/status",
          "/avos/enterprise-intelligence-mesh/health",
          "/avos/enterprise-intelligence-mesh/metrics"
        ],
        tags: ["foundation", "mesh"]
      }
    ];

    for (const resource of resources) {
      this.register(resource, "system", true);
    }
  }

  register(
    dto: RegisterPlatformResourceDto,
    actorId: string,
    allowReplace = false
  ): PlatformResource {
    this.environments.get(dto.environmentId);

    if (this.resources.has(dto.id) && !allowReplace) {
      throw new ConflictException(`Platform resource already exists: ${dto.id}`);
    }

    const now = this.ids.now();
    const existing = this.resources.get(dto.id);

    const resource: PlatformResource = {
      id: dto.id,
      name: dto.name.trim(),
      kind: dto.kind,
      version: dto.version ?? "1.0.0",
      environmentId: dto.environmentId,
      status: dto.status ?? "registered",
      owner: dto.owner.trim(),
      dependencies: [...(dto.dependencies ?? [])],
      endpoints: [...(dto.endpoints ?? [])],
      tags: [...(dto.tags ?? [])],
      metadata: { ...(dto.metadata ?? {}) },
      registeredAt: existing?.registeredAt ?? now,
      updatedAt: now
    };

    this.resources.set(resource.id, resource);
    this.audit.record({
      action: existing
        ? "platform.resource.updated"
        : "platform.resource.registered",
      actorId,
      resourceType: resource.kind,
      resourceId: resource.id,
      environmentId: resource.environmentId,
      outcome: "success",
      details: {
        name: resource.name,
        version: resource.version,
        status: resource.status
      }
    });

    return resource;
  }

  list(filters?: {
    environmentId?: string;
    kind?: PlatformResourceKind;
    status?: PlatformResourceStatus;
  }): PlatformResource[] {
    return [...this.resources.values()]
      .filter(
        (resource) =>
          !filters?.environmentId ||
          resource.environmentId === filters.environmentId
      )
      .filter((resource) => !filters?.kind || resource.kind === filters.kind)
      .filter(
        (resource) => !filters?.status || resource.status === filters.status
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get(id: string): PlatformResource {
    const resource = this.resources.get(id);
    if (!resource) {
      throw new NotFoundException(`Platform resource not found: ${id}`);
    }
    return resource;
  }

  updateStatus(
    id: string,
    status: PlatformResourceStatus,
    actorId: string
  ): PlatformResource {
    const current = this.get(id);
    const updated: PlatformResource = {
      ...current,
      status,
      updatedAt: this.ids.now()
    };
    this.resources.set(id, updated);

    this.audit.record({
      action: "platform.resource.status.changed",
      actorId,
      resourceType: updated.kind,
      resourceId: updated.id,
      environmentId: updated.environmentId,
      outcome: "success",
      details: { previousStatus: current.status, currentStatus: status }
    });

    return updated;
  }

  dependencyGraph() {
    const nodes = this.list();
    const edges = nodes.flatMap((resource) =>
      resource.dependencies.map((dependency) => ({
        from: resource.id,
        to: dependency,
        relation: "depends-on" as const,
        resolved: this.resources.has(dependency)
      }))
    );

    return { nodes, edges };
  }
}