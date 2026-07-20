import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AgsDurablePersistenceCertificationService } from "./ags-durable-persistence-certification.service";
import { AgsDistributedQueueService } from "./ags-distributed-queue.service";
import { AgsDistributedWorkerService } from "./ags-distributed-worker.service";
import { AgsDurableAuditService } from "./ags-durable-audit.service";
import { AgsDurablePersistenceHealthService } from "./ags-durable-persistence-health.service";
import { AgsDurableWorkflowService } from "./ags-durable-workflow.service";
import { AgsEventStoreService } from "./ags-event-store.service";
import { AgsTransactionalOutboxService } from "./ags-transactional-outbox.service";

@Controller("avos/products/adaptive-growth-studio/durable")
export class AgsDurablePersistenceController {
  constructor(
    private readonly workflows: AgsDurableWorkflowService,
    private readonly events: AgsEventStoreService,
    private readonly queue: AgsDistributedQueueService,
    private readonly outbox: AgsTransactionalOutboxService,
    private readonly worker: AgsDistributedWorkerService,
    private readonly audit: AgsDurableAuditService,
    private readonly health: AgsDurablePersistenceHealthService,
    private readonly certification: AgsDurablePersistenceCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.health.evaluate();
  }

  @Post("workflows")
  createWorkflow(
    @Body() input: Parameters<AgsDurableWorkflowService["create"]>[0],
  ) {
    return this.workflows.create(input);
  }

  @Post("workflows/:id/start")
  startWorkflow(
    @Param("id") id: string,
    @Body() input: { actor?: string },
  ) {
    return this.workflows.start(id, input?.actor);
  }

  @Get("workflows")
  listWorkflows(@Query("state") state?: string) {
    return this.workflows.list(state);
  }

  @Get("workflows/:id")
  getWorkflow(@Param("id") id: string) {
    return this.workflows.get(id);
  }

  @Get("events")
  recentEvents(@Query("limit") limit?: string) {
    return this.events.recent(limit ? Number(limit) : 100);
  }

  @Get("events/:streamId")
  stream(@Param("streamId") streamId: string) {
    return this.events.readStream(streamId);
  }

  @Post("queue/enqueue")
  enqueue(
    @Body() input: Parameters<AgsDistributedQueueService["enqueue"]>[0],
  ) {
    return this.queue.enqueue(input);
  }

  @Get("queue/status")
  queueStatus() {
    return this.queue.status();
  }

  @Get("outbox/status")
  outboxStatus() {
    return this.outbox.status();
  }

  @Post("worker/drain")
  drain(@Body() input: { limit?: number }) {
    return this.worker.drain(input?.limit);
  }

  @Get("worker/status")
  workerStatus() {
    return this.worker.status();
  }

  @Get("audit")
  auditList(
    @Query("entityType") entityType?: string,
    @Query("entityId") entityId?: string,
  ) {
    return this.audit.list(entityType, entityId);
  }
  @Post("verification/run")
  verify() {
    return this.certification.verify();
  }

  @Post("certification/certify")
  certify(@Body() input: { approvedBy?: string }) {
    return this.certification.certify(input?.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}