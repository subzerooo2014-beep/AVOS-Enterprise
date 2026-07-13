import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { VehicleLifecycleOrchestratorService } from "./vehicle-lifecycle-orchestrator.service";
import { VehicleLifecycleInput } from "./vehicle-lifecycle.types";

@Controller("vehicle-lifecycle")
export class VehicleLifecycleController {
  constructor(
    private readonly lifecycle: VehicleLifecycleOrchestratorService,
  ) {}

  @Post()
  async start(@Body() input: VehicleLifecycleInput) {
    return {
      success: true,
      record: await this.lifecycle.start(input),
    };
  }

  @Post(":id/process")
  async process(@Param("id") id: string) {
    return {
      success: true,
      record: await this.lifecycle.process(id),
    };
  }

  @Get()
  list() {
    return {
      success: true,
      records: this.lifecycle.list(),
    };
  }

  @Get(":id")
  get(@Param("id") id: string) {
    const record = this.lifecycle.get(id);

    return {
      success: Boolean(record),
      record: record ?? null,
    };
  }

  @Get("system/status")
  status() {
    const records = this.lifecycle.list();

    return {
      success: true,
      system: "AVOS Vehicle Lifecycle Integration",
      status: "running",
      total: records.length,
      completed: records.filter((item) => item.stage === "DECIDED").length,
      failed: records.filter((item) => item.stage === "FAILED").length,
    };
  }
}
