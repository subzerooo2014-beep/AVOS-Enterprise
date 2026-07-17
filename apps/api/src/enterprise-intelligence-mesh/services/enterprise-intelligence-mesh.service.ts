import { Injectable } from "@nestjs/common";
import type {
  MeshHealth,
  MeshRequest,
  MeshRouteKind
} from "../contracts/enterprise-intelligence-mesh.contracts";
import type {
  ExecuteMeshRequestDto,
  PublishMeshEventDto,
  RegisterMeshNodeDto
} from "../dto/enterprise-intelligence-mesh.dto";
import { MeshEventService } from "./mesh-event.service";
import { MeshIdService } from "./mesh-id.service";
import { MeshMemoryService } from "./mesh-memory.service";
import { MeshRegistryService } from "./mesh-registry.service";
import { MeshRouterService } from "./mesh-router.service";
import { MeshTraceService } from "./mesh-trace.service";

@Injectable()
export class EnterpriseIntelligenceMeshService {
  constructor(
    private readonly ids: MeshIdService,
    private readonly registry: MeshRegistryService,
    private readonly router: MeshRouterService,
    private readonly memory: MeshMemoryService,
    private readonly events: MeshEventService,
    private readonly traces: MeshTraceService
  ) {}

  execute(dto: ExecuteMeshRequestDto) {
    const request: MeshRequest = {
      id: this.ids.create(),
      route: dto.route,
      action: dto.action,
      payload: { ...(dto.payload ?? {}) },
      context: {
        correlationId: dto.context.correlationId ?? this.ids.create(),
        causationId: dto.context.causationId,
        traceId: dto.context.traceId ?? this.ids.create(),
        source: dto.context.source,
        priority: dto.context.priority ?? "normal",
        identity: {
          tenantId: dto.context.identity.tenantId,
          actorId: dto.context.identity.actorId,
          actorType: dto.context.identity.actorType,
          roles: [...dto.context.identity.roles]
        },
        metadata: { ...(dto.context.metadata ?? {}) }
      },
      createdAt: this.ids.now()
    };

    return this.router.execute(request);
  }

  register(dto: RegisterMeshNodeDto) {
    return this.registry.register(dto);
  }

  heartbeat(id: string, status: "online" | "degraded" | "offline") {
    return this.registry.heartbeat(id, status);
  }

  nodes(kind?: MeshRouteKind) {
    return this.registry.list(kind);
  }

  graph() {
    return this.registry.graph();
  }

  request(id: string) {
    return {
      request: this.memory.getRequest(id),
      result: this.memory.getResult(id),
      traces: this.traces.list(id)
    };
  }

  requests() {
    return this.memory.listRequests();
  }

  results() {
    return this.memory.listResults();
  }

  publish(dto: PublishMeshEventDto) {
    return this.events.publish(dto);
  }

  eventList(topic?: string) {
    return this.events.list(topic);
  }

  metrics() {
    const memory = this.memory.metrics();
    const health = this.health();

    return {
      system: "AVOS Enterprise Intelligence Mesh",
      requests: memory.requests,
      completed: memory.completed,
      failed: memory.failed,
      events: this.events.count(),
      traces: this.traces.count(),
      nodes: this.registry.list().length,
      successRate: health.successRate,
      generatedAt: this.ids.now()
    };
  }

  health(): MeshHealth {
    const nodes = this.registry.list();
    const memory = this.memory.metrics();
    const onlineNodes = nodes.filter((node) => node.status === "online").length;
    const degradedNodes = nodes.filter(
      (node) => node.status === "degraded"
    ).length;
    const offlineNodes = nodes.filter((node) => node.status === "offline").length;
    const successRate =
      memory.completed + memory.failed === 0
        ? 100
        : Math.round(
            (memory.completed / (memory.completed + memory.failed)) * 100
          );

    const score = Math.max(
      0,
      Math.min(
        100,
        100 - degradedNodes * 5 - offlineNodes * 15 - memory.failed * 3
      )
    );

    return {
      system: "AVOS Enterprise Intelligence Mesh",
      status: score >= 90 ? "healthy" : score >= 70 ? "degraded" : "critical",
      score,
      nodeCount: nodes.length,
      onlineNodes,
      degradedNodes,
      offlineNodes,
      requestCount: memory.requests,
      completedCount: memory.completed,
      failedCount: memory.failed,
      successRate,
      generatedAt: this.ids.now()
    };
  }

  status() {
    const health = this.health();
    return {
      success: true,
      system: "AVOS Enterprise Intelligence Mesh",
      status: health.status === "healthy" ? "operational" : health.status,
      version: "1.0.0",
      health,
      capabilities: [
        "unified-mesh-routing",
        "service-registry",
        "runtime-dependency-graph",
        "policy-controlled-execution",
        "event-publication",
        "execution-tracing",
        "mesh-memory",
        "health-and-metrics",
        "final-review",
        "certification"
      ],
      integrations: this.registry.list().map((node) => ({
        id: node.id,
        kind: node.kind,
        status: node.status,
        actions: node.actions
      })),
      timestamp: this.ids.now()
    };
  }

  finalReview() {
    const health = this.health();
    const checks = {
      registryAvailable: this.registry.list().length >= 7,
      kernelRegistered: this.registry
        .list()
        .some((node) => node.id === "enterprise-kernel"),
      capabilityFabricRegistered: this.registry
        .list()
        .some((node) => node.id === "capability-fabric"),
      knowledgeFabricRegistered: this.registry
        .list()
        .some((node) => node.id === "knowledge-fabric"),
      decisionIntelligenceRegistered: this.registry
        .list()
        .some((node) => node.id === "enterprise-decision-intelligence"),
      orchestrationRegistered: this.registry
        .list()
        .some((node) => node.id === "autonomous-orchestration"),
      nervousSystemRegistered: this.registry
        .list()
        .some((node) => node.id === "enterprise-nervous-system"),
      healthAcceptable: health.score >= 90
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const score = Math.round((passed / total) * 100);

    return {
      id: `enterprise-intelligence-mesh-final-review:${Date.now()}`,
      system: "AVOS Enterprise Intelligence Mesh",
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
      id: `enterprise-intelligence-mesh-certification:${Date.now()}`,
      reviewId: review.id,
      system: "AVOS Enterprise Intelligence Mesh",
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