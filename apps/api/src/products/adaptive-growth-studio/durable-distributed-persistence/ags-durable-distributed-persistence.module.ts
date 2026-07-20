import { AgsDurablePersistenceCertificationService } from "./ags-durable-persistence-certification.service";
import { Module } from "@nestjs/common";
import { AgsDistributedQueueService } from "./ags-distributed-queue.service";
import { AgsDistributedWorkerService } from "./ags-distributed-worker.service";
import { AgsDurableAuditService } from "./ags-durable-audit.service";
import { AgsDurableIdService } from "./ags-durable-id.service";
import { AgsDurablePersistenceController } from "./ags-durable-persistence.controller";
import { AgsDurablePersistenceHealthService } from "./ags-durable-persistence-health.service";
import { AgsDurableWorkflowService } from "./ags-durable-workflow.service";
import { AgsEventStoreService } from "./ags-event-store.service";
import { AgsIdempotencyService } from "./ags-idempotency.service";
import { AgsTransactionalOutboxService } from "./ags-transactional-outbox.service";

@Module({
  controllers: [AgsDurablePersistenceController],
  providers: [
    AgsDurableIdService,
    AgsDurableAuditService,
    AgsEventStoreService,
    AgsTransactionalOutboxService,
    AgsDistributedQueueService,
    AgsIdempotencyService,
    AgsDurableWorkflowService,
    AgsDistributedWorkerService,
    AgsDurablePersistenceHealthService,
    AgsDurablePersistenceCertificationService,
  ],
  exports: [
    AgsDistributedQueueService,
    AgsEventStoreService,
    AgsDurableWorkflowService,
    AgsDurablePersistenceHealthService,
    AgsDurablePersistenceCertificationService,
  ],
})
export class AgsDurableDistributedPersistenceModule {}