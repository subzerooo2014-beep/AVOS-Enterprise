import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { VehicleBrainIntegrationQueueService } from "./vehicle-brain-integration-queue.service";
import { VehicleBrainIntegrationOrchestratorService } from "./vehicle-brain-integration-orchestrator.service";
import { VehicleBrainIntegrationCommand } from "./vehicle-brain-integration.types";

@Controller("vehicle-brain-integration")
export class VehicleBrainIntegrationController {
  constructor(
    private readonly queue: VehicleBrainIntegrationQueueService,
    private readonly orchestrator: VehicleBrainIntegrationOrchestratorService,
  ) {}

  @Post("commands")
  enqueue(@Body() command: VehicleBrainIntegrationCommand) {
    return {
      success: true,
      record: this.queue.enqueue(command),
    };
  }

  @Post("commands/:id/process")
  process(@Param("id") id: string) {
    return {
      success: true,
      record: this.orchestrator.process(id),
    };
  }

  @Post("process-latest")
  processLatest(@Query("limit") limit?: string) {
    const processed = this.orchestrator.processLatest(
      limit ? Number(limit) : 20,
    );

    return {
      success: true,
      processed: processed.length,
      records: processed,
    };
  }

  @Get("commands")
  list() {
    return {
      success: true,
      records: this.queue.list(),
    };
  }

  @Get("status")
  status() {
    const records = this.queue.list();

    return {
      success: true,
      system: "AVOS Vehicle Brain Integration",
      status: "running",
      queued: records.filter((item) => item.status === "queued").length,
      completed: records.filter((item) => item.status === "completed").length,
      failed: records.filter((item) => item.status === "failed").length,
    };
  }
}
