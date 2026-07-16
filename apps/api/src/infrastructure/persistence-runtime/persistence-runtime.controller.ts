import { Controller, Get, Param, Post } from "@nestjs/common";
import { OptimisticLockService } from "./optimistic-lock.service";
import { PersistenceCacheService } from "./persistence-cache.service";
import { PersistenceEventsService } from "./persistence-events.service";
import { PersistenceMetricsService } from "./persistence-metrics.service";
import { PersistenceRuntimeService } from "./persistence-runtime.service";
import { RepositoryOrchestratorService } from "./repository-orchestrator.service";

@Controller("persistence-foundation/runtime")
export class PersistenceRuntimeController {
  constructor(
    private readonly runtime: PersistenceRuntimeService,
    private readonly orchestrator: RepositoryOrchestratorService,
    private readonly cache: PersistenceCacheService,
    private readonly optimisticLock: OptimisticLockService,
    private readonly events: PersistenceEventsService,
    private readonly metrics: PersistenceMetricsService,
  ) {}

  @Get("status")
  status() {
    return this.runtime.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.runtime.diagnostics();
  }

  @Get("repositories/resolve/:token")
  resolve(@Param("token") token: string) {
    return this.orchestrator.resolve(token);
  }

  @Get("repositories/domains")
  domains() {
    return {
      success: true,
      items: this.orchestrator.domains(),
    };
  }

  @Get("events")
  listEvents() {
    return {
      success: true,
      items: this.events.list(),
    };
  }

  @Get("metrics")
  listMetrics() {
    return {
      success: true,
      items: this.metrics.list(),
    };
  }

  @Post("cache/clear")
  clearCache() {
    this.cache.clear();
    return {
      success: true,
      cacheEntries: this.cache.size(),
    };
  }

  @Post("locks/:key/:expectedVersion")
  incrementLock(
    @Param("key") key: string,
    @Param("expectedVersion") expectedVersion: string,
  ) {
    const version = this.optimisticLock.assertAndIncrement(
      key,
      Number(expectedVersion),
    );

    return {
      success: true,
      key,
      version,
    };
  }
}
