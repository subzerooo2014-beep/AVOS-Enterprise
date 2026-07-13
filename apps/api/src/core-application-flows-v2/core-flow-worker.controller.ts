import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowWorkerRegistryService } from "./core-flow-worker-registry.service";
import { CoreFlowDurableMessagingService } from "./core-flow-durable-messaging.service";
import { CoreFlowWorkerRuntimeService } from "./core-flow-worker-runtime.service";

@Controller("core-flow-workers")
export class CoreFlowWorkerController {
  constructor(
    private readonly workers: CoreFlowWorkerRegistryService,
    private readonly messaging: CoreFlowDurableMessagingService,
    private readonly runtime: CoreFlowWorkerRuntimeService,
  ) {}

  @Post()
  register(@Body() dto: any) {
    return this.workers.register(dto);
  }

  @Get()
  list() {
    return this.workers.findAll();
  }

  @Post(":id/heartbeat")
  heartbeat(@Param("id") id: string, @Body() dto: any) {
    return this.workers.heartbeat(id, dto?.leaseMs);
  }

  @Post("maintenance/offline-expired")
  offlineExpired() {
    return this.workers.markOfflineExpired();
  }

  @Post(":workerId/claim/:executionId")
  claim(
    @Param("workerId") workerId: string,
    @Param("executionId") executionId: string,
  ) {
    return this.runtime.claimAndProcess(workerId, executionId);
  }

  @Post("outbox")
  enqueueOutbox(@Body() dto: any) {
    return this.messaging.enqueueOutbox(dto?.topic, dto?.payload);
  }

  @Get("outbox/pending")
  pendingOutbox(@Query("limit") limit?: string) {
    return this.messaging.pendingOutbox(Number(limit ?? 50));
  }

  @Post("outbox/:id/published")
  markPublished(@Param("id") id: string) {
    return this.messaging.markPublished(id);
  }

  @Post("outbox/:id/failed")
  markFailed(@Param("id") id: string, @Body() dto: any) {
    return this.messaging.markFailed(id, dto?.error, dto?.maxAttempts);
  }

  @Post("outbox/:id/replay")
  replay(@Param("id") id: string) {
    return this.messaging.replayDeadLetter(id);
  }

  @Post("inbox")
  acceptInbox(@Body() dto: any) {
    return this.messaging.acceptInbox(dto?.source, dto?.messageKey, dto?.payload);
  }

  @Get("dashboard")
  dashboard() {
    return this.runtime.dashboard();
  }
}
