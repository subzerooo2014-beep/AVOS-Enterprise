import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowOutboxService } from "./core-flow-outbox.service";
import { CoreFlowSnapshotService } from "./core-flow-snapshot.service";
import { CoreFlowWorkerService } from "./core-flow-worker.service";

@Controller("core-flow-operations")
export class CoreFlowOperationsController {
  constructor(
    private readonly outbox: CoreFlowOutboxService,
    private readonly worker: CoreFlowWorkerService,
    private readonly audit: CoreFlowAuditService,
    private readonly snapshots: CoreFlowSnapshotService,
  ) {}

  @Post()
  enqueue(@Body() dto: any) {
    return this.outbox.enqueue(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.outbox.findAll(query);
  }

  @Get("dashboard")
  dashboard() {
    return {
      queue: this.outbox.dashboard(),
      audit: this.audit.stats(),
    };
  }

  @Post("process-next")
  processNext() {
    return this.worker.processNext();
  }

  @Post("process-batch")
  processBatch(@Body() dto: any) {
    return this.worker.processBatch(dto?.limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.outbox.findOne(id);
  }

  @Post(":id/retry")
  retry(@Param("id") id: string) {
    return this.outbox.retry(id);
  }

  @Post(":id/compensate")
  compensate(@Param("id") id: string, @Body() dto: any) {
    return this.outbox.compensate(id, dto?.reason);
  }

  @Get(":id/audit")
  auditTrail(@Param("id") id: string) {
    return this.audit.findAll(id);
  }

  @Get(":id/snapshots")
  snapshotHistory(@Param("id") id: string) {
    return this.snapshots.history(id);
  }

  @Get(":id/snapshots/latest")
  latestSnapshot(@Param("id") id: string) {
    return this.snapshots.latest(id);
  }
}
