import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ExecuteKnowledgeRuntimeInput, InvalidateKnowledgeRuntimeCacheInput, KnowledgeRuntimeQueryInput } from "./knowledge-runtime.contracts";
import { KnowledgeRuntimeCacheService } from "./knowledge-runtime-cache.service";
import { KnowledgeRuntimeEngineService } from "./knowledge-runtime-engine.service";
import { KnowledgeRuntimeEventsService } from "./knowledge-runtime-events.service";
import { KnowledgeRuntimeHealthService } from "./knowledge-runtime-health.service";
import { KnowledgeRuntimeMetricsService } from "./knowledge-runtime-metrics.service";
import { KnowledgeRuntimeSessionService } from "./knowledge-runtime-session.service";

@Controller("knowledge-fabric/runtime")
export class KnowledgeRuntimeController {
  constructor(
    private readonly engine: KnowledgeRuntimeEngineService,
    private readonly sessions: KnowledgeRuntimeSessionService,
    private readonly health: KnowledgeRuntimeHealthService,
    private readonly cache: KnowledgeRuntimeCacheService,
    private readonly events: KnowledgeRuntimeEventsService,
    private readonly metrics: KnowledgeRuntimeMetricsService,
  ) {}

  @Get("status") status() { return this.health.status(); }
  @Get("health") healthCheck() { return this.health.status(); }
  @Get("metrics") metricsSnapshot() { return { success: true, metrics: this.metrics.snapshot() }; }
  @Get("events") runtimeEvents(@Query("limit") limit?: string) { return { success: true, items: this.events.list(Number(limit ?? 100)) }; }
  @Get("sessions") listSessions() { return { success: true, items: this.sessions.list() }; }
  @Get("sessions/:id") getSession(@Param("id") id: string) { return { success: true, item: this.sessions.get(id) }; }

  @Post("execute") execute(@Body() input: ExecuteKnowledgeRuntimeInput) { return this.engine.execute(input); }
  @Post("query") queryKnowledge(@Body() input: KnowledgeRuntimeQueryInput) {
    return this.engine.execute({
      operation: "QUERY",
      query: input.query,
      namespace: input.namespace,
      tags: input.tags,
      limit: input.limit,
      minimumTrustScore: input.minimumTrustScore,
      correlationId: input.correlationId,
      principal: {
        id: input.principalId ?? "anonymous",
        type: input.principalType ?? "USER",
        roles: input.roles ?? [],
        permissions: input.permissions ?? ["knowledge:read"],
      },
    });
  }

  @Post("cache/invalidate") invalidateCache(@Body() input: InvalidateKnowledgeRuntimeCacheInput) {
    const removed = this.cache.invalidate((key, value) => {
      if (input.all) return true;
      if (input.knowledgeId && value.knowledgeId === input.knowledgeId) return true;
      if (input.namespace && value.namespace === input.namespace) return true;
      return false;
    });
    return { success: true, removed };
  }
}
