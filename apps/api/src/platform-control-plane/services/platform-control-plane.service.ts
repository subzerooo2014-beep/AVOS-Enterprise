import { Injectable } from "@nestjs/common";
import type {
  PlatformHealth,
  PlatformResourceKind,
  PlatformResourceStatus
} from "../contracts/platform-control-plane.contracts";
import type {
  CreatePlatformEnvironmentDto,
  RegisterPlatformResourceDto,
  SetPlatformConfigurationDto
} from "../dto/platform-control-plane.dto";
import { PlatformAuditService } from "./platform-audit.service";
import { PlatformConfigurationService } from "./platform-configuration.service";
import { PlatformEnvironmentService } from "./platform-environment.service";
import { PlatformIdService } from "./platform-id.service";
import { PlatformRegistryService } from "./platform-registry.service";

@Injectable()
export class PlatformControlPlaneService {
  constructor(
    private readonly ids: PlatformIdService,
    private readonly environments: PlatformEnvironmentService,
    private readonly registry: PlatformRegistryService,
    private readonly configurations: PlatformConfigurationService,
    private readonly audit: PlatformAuditService
  ) {}

  createEnvironment(dto: CreatePlatformEnvironmentDto, actorId: string) {
    return this.environments.create(dto, actorId);
  }

  environmentList() {
    return this.environments.list();
  }

  environment(id: string) {
    return this.environments.get(id);
  }

  registerResource(dto: RegisterPlatformResourceDto, actorId: string) {
    return this.registry.register(dto, actorId);
  }

  resourceList(filters?: {
    environmentId?: string;
    kind?: PlatformResourceKind;
    status?: PlatformResourceStatus;
  }) {
    return this.registry.list(filters);
  }

  resource(id: string) {
    return this.registry.get(id);
  }

  updateResourceStatus(
    id: string,
    status: PlatformResourceStatus,
    actorId: string
  ) {
    return this.registry.updateStatus(id, status, actorId);
  }

  dependencyGraph() {
    return this.registry.dependencyGraph();
  }

  setConfiguration(dto: SetPlatformConfigurationDto) {
    return this.configurations.set(dto);
  }

  configurationList(environmentId?: string, namespace?: string) {
    return this.configurations.list(environmentId, namespace);
  }

  configuration(
    environmentId: string,
    namespace: string,
    key: string
  ) {
    return this.configurations.get(environmentId, namespace, key);
  }

  auditList(limit?: number) {
    return this.audit.list(limit);
  }

  health(): PlatformHealth {
    const resources = this.registry.list();
    const running = resources.filter(
      (resource) => resource.status === "running"
    ).length;
    const degraded = resources.filter(
      (resource) => resource.status === "degraded"
    ).length;
    const failed = resources.filter(
      (resource) => resource.status === "failed"
    ).length;

    const score = Math.max(
      0,
      Math.min(100, 100 - degraded * 5 - failed * 15)
    );

    return {
      system: "AVOS Platform Control Plane",
      status: score >= 90 ? "healthy" : score >= 70 ? "degraded" : "critical",
      score,
      environments: this.environments.list().length,
      resources: resources.length,
      runningResources: running,
      degradedResources: degraded,
      failedResources: failed,
      configurationEntries: this.configurations.count(),
      generatedAt: this.ids.now()
    };
  }

  metrics() {
    const health = this.health();
    return {
      system: "AVOS Platform Control Plane",
      environments: health.environments,
      resources: health.resources,
      runningResources: health.runningResources,
      degradedResources: health.degradedResources,
      failedResources: health.failedResources,
      configurationEntries: health.configurationEntries,
      auditRecords: this.audit.count(),
      healthScore: health.score,
      generatedAt: this.ids.now()
    };
  }

  status() {
    return {
      success: true,
      system: "AVOS Platform Control Plane",
      stage: "Platform",
      pack: "1A",
      version: "1.0.0",
      status: this.health().status === "healthy" ? "operational" : this.health().status,
      capabilities: [
        "platform-environment-registry",
        "platform-resource-registry",
        "foundation-resource-discovery",
        "platform-configuration",
        "dependency-graph",
        "platform-audit",
        "health-and-metrics",
        "final-review",
        "certification"
      ],
      health: this.health(),
      generatedAt: this.ids.now()
    };
  }

  finalReview() {
    const health = this.health();
    const resources = this.registry.list();
    const graph = this.registry.dependencyGraph();

    const checks = {
      environmentsCreated: this.environments.list().length === 4,
      developmentEnvironmentExists:
        this.environments.findByKind("development") !== undefined,
      productionEnvironmentExists:
        this.environments.findByKind("production") !== undefined,
      foundationResourcesRegistered: resources.length >= 7,
      enterpriseKernelRegistered: resources.some(
        (resource) => resource.id === "enterprise-kernel"
      ),
      intelligenceMeshRegistered: resources.some(
        (resource) => resource.id === "enterprise-intelligence-mesh"
      ),
      dependencyGraphResolved: graph.edges.every((edge) => edge.resolved),
      healthAcceptable: health.score >= 90
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const score = Math.round((passed / total) * 100);

    return {
      id: `platform-control-plane-final-review:${Date.now()}`,
      system: "AVOS Platform Control Plane",
      pack: "1A",
      status: score === 100 ? "passed" : "attention-required",
      score,
      checks,
      health,
      reviewedAt: this.ids.now()
    };
  }

  certify() {
    const review = this.finalReview();

    return {
      id: `platform-control-plane-certification:${Date.now()}`,
      reviewId: review.id,
      system: "AVOS Platform Control Plane",
      pack: "1A",
      status: review.score === 100 ? "certified" : "not-certified",
      score: review.score,
      level:
        review.score === 100
          ? "excellent"
          : review.score >= 90
            ? "good"
            : "needs-attention",
      certifiedAt: this.ids.now()
    };
  }
}