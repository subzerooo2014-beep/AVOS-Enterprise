import { Injectable } from "@nestjs/common";
import { RepositoryRegistryService } from "../repository-registry/repository-registry.service";
import { UnitOfWorkService } from "../unit-of-work/unit-of-work.service";
import { ConcurrencyManagerService } from "./concurrency-manager.service";
import { OptimisticLockService } from "./optimistic-lock.service";
import { PersistenceCacheService } from "./persistence-cache.service";
import { PersistenceEventsService } from "./persistence-events.service";
import { PersistenceMetricsService } from "./persistence-metrics.service";
import type { PersistenceRuntimeHealth } from "./persistence-runtime.types";

@Injectable()
export class PersistenceRuntimeService {
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly repositoryRegistry: RepositoryRegistryService,
    private readonly cache: PersistenceCacheService,
    private readonly optimisticLock: OptimisticLockService,
    private readonly concurrency: ConcurrencyManagerService,
    private readonly events: PersistenceEventsService,
    private readonly metricsService: PersistenceMetricsService,
  ) {}

  health(): PersistenceRuntimeHealth {
    const repositoryHealth = this.repositoryRegistry.health();
    const metrics = this.metricsService.metrics(
      this.cache.size(),
      this.events.count(),
    );

    const degraded =
      repositoryHealth.status === "DEGRADED" ||
      metrics.failedOperations > 0;

    return {
      success: true,
      system: "AVOS Persistence Runtime",
      version: "1.0.0",
      status: degraded ? "DEGRADED" : "READY",
      metrics,
      components: {
        unitOfWork: this.unitOfWork.status().status,
        repositoryRegistry: repositoryHealth.status,
        distributedTransactions: "READY",
        cache: "READY",
        optimisticLocking: "READY",
        concurrency: "READY",
        events: "READY",
        retryPolicies: "READY",
        recovery: "READY",
        observability: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      system: "AVOS Persistence Runtime Diagnostics",
      health: this.health(),
      activeLocks: this.concurrency.activeLocks(),
      optimisticLocks: this.optimisticLock.snapshot(),
      cache: this.cache.snapshot(),
      recentEvents: this.events.list(50),
      recentOperations: this.metricsService.list(50),
    };
  }
}
