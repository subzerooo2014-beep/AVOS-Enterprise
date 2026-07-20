import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UltraSuiteAdapterRegistryService } from "./adapters/ultra-suite-adapter-registry.service";
import { ProductionRuntimeCertificationService } from "./certification/production-runtime-certification.service";
import { DistributedTaskRuntimeService } from "./distributed/distributed-task-runtime.service";
import { RuntimeNodeRegistryService } from "./distributed/runtime-node-registry.service";
import { IdempotentInboxService } from "./messaging/idempotent-inbox.service";
import { TransactionalOutboxService } from "./messaging/transactional-outbox.service";
import { ProductionPersistenceService } from "./persistence/production-persistence.service";
import { ProductionRuntimeReportService } from "./reporting/production-runtime-report.service";
import { ProductionPlatformRuntimeService } from "./runtime/production-platform-runtime.service";
import { WorkflowCheckpointService } from "./recovery/workflow-checkpoint.service";

@Controller("avos/unified-platform/production")
export class ProductionRuntimeController {
  constructor(
    private readonly runtime: ProductionPlatformRuntimeService,
    private readonly persistence: ProductionPersistenceService,
    private readonly adapters: UltraSuiteAdapterRegistryService,
    private readonly nodes: RuntimeNodeRegistryService,
    private readonly tasks: DistributedTaskRuntimeService,
    private readonly outbox: TransactionalOutboxService,
    private readonly inbox: IdempotentInboxService,
    private readonly checkpoints: WorkflowCheckpointService,
    private readonly certification: ProductionRuntimeCertificationService,
    private readonly report: ProductionRuntimeReportService
  ) {}

  @Post("boot") boot() { return this.runtime.boot(); }
  @Get("status") status() { return this.runtime.status(); }
  @Get("persistence/status") persistenceStatus() { return this.persistence.status(); }

  @Get("adapters") adaptersList() { return this.adapters.list(); }
  @Post("adapters/refresh") adaptersRefresh() { return this.adapters.refreshAll(); }
  @Get("adapters/health") adaptersHealth() { return this.adapters.healthAll(); }
  @Get("adapters/:suiteId/health") adapterHealth(@Param("suiteId") suiteId: string) {
    return this.adapters.health(suiteId);
  }
  @Post("adapters/:suiteId/execute")
  adapterExecute(
    @Param("suiteId") suiteId: string,
    @Body() body: { action?: string; payload?: Record<string, unknown> }
  ) {
    return this.adapters.execute(suiteId, body.action ?? "status", body.payload ?? {});
  }

  @Get("nodes") nodesList() { return this.nodes.listActive(); }
  @Post("nodes/heartbeat") nodeHeartbeat() { return this.nodes.heartbeat(); }

  @Post("tasks/enqueue")
  taskEnqueue(@Body() body: { type?: string; payload?: unknown; maxAttempts?: number }) {
    return this.tasks.enqueue(body.type ?? "platform.task", body.payload ?? {}, body.maxAttempts ?? 3);
  }
  @Post("tasks/execute-next") taskExecuteNext() { return this.tasks.executeNext(); }
  @Post("tasks/recover") taskRecover() { return this.tasks.recoverExpiredLeases(); }
  @Get("tasks/metrics") taskMetrics() { return this.tasks.metrics(); }

  @Post("outbox")
  outboxEnqueue(@Body() body: { topic?: string; key?: string; payload?: unknown }) {
    return this.outbox.enqueue(body.topic ?? "avos.platform.event", body.key ?? "default", body.payload ?? {});
  }
  @Get("outbox/metrics") outboxMetrics() { return this.outbox.metrics(); }

  @Post("inbox")
  inboxReceive(@Body() body: { source?: string; messageId?: string; payload?: unknown }) {
    return this.inbox.receive(
      body.source ?? "unknown",
      body.messageId ?? `message-${Date.now()}`,
      body.payload ?? {}
    );
  }
  @Get("inbox/metrics") inboxMetrics() { return this.inbox.metrics(); }

  @Post("checkpoints")
  checkpointSave(@Body() body: { workflowRunId: string; stepId: string; state?: Record<string, unknown> }) {
    return this.checkpoints.save(body.workflowRunId, body.stepId, body.state ?? {});
  }

  @Post("smoke/run") smoke() { return this.certification.smoke(); }
  @Post("certification/certify")
  certify(@Body() body: { approvedBy?: string }) {
    return this.certification.certify(body.approvedBy ?? "human:pending");
  }
  @Get("certification/status") certificationStatus() { return this.certification.status(); }
  @Get("report") productionReport() { return this.report.generate(); }
}