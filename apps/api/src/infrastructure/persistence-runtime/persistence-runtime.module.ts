import { Module } from "@nestjs/common";
import { RepositoryRegistryModule } from "../repository-registry/repository-registry.module";
import { UnitOfWorkModule } from "../unit-of-work/unit-of-work.module";
import { ConcurrencyManagerService } from "./concurrency-manager.service";
import { DistributedTransactionCoordinatorService } from "./distributed-transaction-coordinator.service";
import { OptimisticLockService } from "./optimistic-lock.service";
import { PersistenceCacheService } from "./persistence-cache.service";
import { PersistenceEventsService } from "./persistence-events.service";
import { PersistenceMetricsService } from "./persistence-metrics.service";
import { PersistenceRuntimeController } from "./persistence-runtime.controller";
import { PersistenceRuntimeService } from "./persistence-runtime.service";
import { RepositoryOrchestratorService } from "./repository-orchestrator.service";
import { RetryPolicyService } from "./retry-policy.service";

@Module({
  imports: [UnitOfWorkModule, RepositoryRegistryModule],
  controllers: [PersistenceRuntimeController],
  providers: [
    ConcurrencyManagerService,
    DistributedTransactionCoordinatorService,
    OptimisticLockService,
    PersistenceCacheService,
    PersistenceEventsService,
    PersistenceMetricsService,
    PersistenceRuntimeService,
    RepositoryOrchestratorService,
    RetryPolicyService,
  ],
  exports: [
    ConcurrencyManagerService,
    DistributedTransactionCoordinatorService,
    OptimisticLockService,
    PersistenceCacheService,
    PersistenceEventsService,
    PersistenceMetricsService,
    PersistenceRuntimeService,
    RepositoryOrchestratorService,
    RetryPolicyService,
  ],
})
export class PersistenceRuntimeModule {}
