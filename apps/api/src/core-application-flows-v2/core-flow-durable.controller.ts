import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowDurableRuntimeService } from "./core-flow-durable-runtime.service";

@Controller("core-flow-durable")
export class CoreFlowDurableController {
  constructor(private readonly runtime: CoreFlowDurableRuntimeService) {}

  @Post("executions")
  enqueue(@Body() dto: any) {
    return this.runtime.enqueue(dto);
  }

  @Get("executions")
  executions(@Query("status") status?: string) {
    return this.runtime.findAll(status);
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.runtime.findOne(id);
  }

  @Post("executions/:id/acquire")
  acquire(@Param("id") id: string, @Body() dto: any) {
    return this.runtime.acquire(id, dto?.workerId ?? "worker-1", dto?.ttlMs);
  }

  @Post("executions/:id/checkpoints")
  checkpoint(@Param("id") id: string, @Body() dto: any) {
    return this.runtime.checkpoint(id, dto?.name ?? "checkpoint", dto?.state ?? {});
  }

  @Post("executions/:id/complete")
  complete(@Param("id") id: string, @Body() dto: any) {
    return this.runtime.complete(id, dto?.result);
  }

  @Post("executions/:id/fail")
  fail(@Param("id") id: string, @Body() dto: any) {
    return this.runtime.fail(id, dto?.error);
  }

  @Post("executions/:id/schedule")
  schedule(@Param("id") id: string, @Body() dto: any) {
    return this.runtime.schedule(id, dto?.executeAt);
  }

  @Post("schedules/dispatch-due")
  dispatchDue() {
    return this.runtime.dispatchDue();
  }

  @Post("recovery/stale-locks")
  recoverStaleLocks() {
    return this.runtime.recoverStaleLocks();
  }

  @Get("dashboard")
  dashboard() {
    return this.runtime.dashboard();
  }
}
