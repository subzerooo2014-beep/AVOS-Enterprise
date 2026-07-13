import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { VehicleLifecyclePrismaOrchestratorService } from "./vehicle-lifecycle-prisma-orchestrator.service";
import { VehicleLifecycleOrchestratorService } from "../lifecycle-integration/vehicle-lifecycle-orchestrator.service";
import { VehicleIntelligencePersistenceService } from "../prisma-intelligence/vehicle-intelligence-persistence.service";
import { VehicleLifecycleInput } from "../lifecycle-integration/vehicle-lifecycle.types";

@Controller("vehicle-lifecycle-prisma")
export class VehicleLifecyclePrismaController {
  constructor(
    private readonly orchestrator: VehicleLifecyclePrismaOrchestratorService,
    private readonly lifecycle: VehicleLifecycleOrchestratorService,
    private readonly persistence: VehicleIntelligencePersistenceService,
  ) {}

  @Post()
  async start(@Body() input: VehicleLifecycleInput) {
    const lifecycle = await this.orchestrator.start(input);
    const persisted =
      await this.persistence.findByLifecycleId(lifecycle.id);

    return {
      success: true,
      lifecycle,
      persisted,
    };
  }

  @Post(":id/process")
  async process(@Param("id") id: string) {
    const lifecycle = await this.orchestrator.process(id);
    const persisted =
      await this.persistence.findByLifecycleId(lifecycle.id);

    return {
      success: true,
      lifecycle,
      persisted,
    };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const lifecycle = this.lifecycle.get(id);
    const persisted =
      await this.persistence.findByLifecycleId(id);

    return {
      success: Boolean(lifecycle || persisted),
      lifecycle: lifecycle ?? null,
      persisted: persisted ?? null,
    };
  }

  @Get("system/status")
  async status() {
    const lifecycleRecords = this.lifecycle.list();
    const prismaStats = await this.persistence.stats();

    return {
      success: true,
      system: "AVOS Vehicle Lifecycle Prisma Integration",
      status: "running",
      lifecycleRecords: lifecycleRecords.length,
      prismaRecords: prismaStats.total,
      decidedRecords: prismaStats.decided,
      failedRecords: prismaStats.failed,
    };
  }
}
