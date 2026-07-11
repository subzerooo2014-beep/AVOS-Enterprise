import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AiDistributionEngineService } from "./ai-distribution-engine.service";

@Controller("ai-distribution-engine")
export class AiDistributionEngineController {
  constructor(private readonly service: AiDistributionEngineService) {}

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }

  @Post("process-queued")
  processQueued(@Query("limit") limit?: string) {
    return this.service.processQueued(limit ? Number(limit) : 20);
  }

  @Post("retry-failed")
  retryFailed(@Query("limit") limit?: string) {
    return this.service.retryFailed(limit ? Number(limit) : 20);
  }

  @Get("channel/:channel")
  channelReport(@Param("channel") channel: string) {
    return this.service.channelReport(channel);
  }

  @Get("vehicle/:id")
  vehicleReport(@Param("id") id: string) {
    return this.service.vehicleReport(id);
  }
}
