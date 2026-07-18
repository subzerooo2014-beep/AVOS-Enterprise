import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AutonomousFactoryOrchestratorService } from "./autonomous-factory-orchestrator.service";
import {
  ApproveFactoryWorkItemInput,
  CreateFactoryWorkItemInput,
} from "./factory-intelligence.contracts";

@Controller("avos-factory/autonomous-production")
export class AutonomousFactoryController {
  constructor(
    private readonly orchestrator: AutonomousFactoryOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.verification();
  }

  @Get("verification")
  verification() {
    return this.orchestrator.verification();
  }

  @Get("work-items")
  workItems() {
    return this.orchestrator.listWorkItems();
  }

  @Get("work-items/:id")
  workItem(@Param("id") id: string) {
    return this.orchestrator.getWorkItem(id);
  }

  @Get("work-items/:id/plan")
  plan(@Param("id") id: string) {
    return this.orchestrator.getPlan(id);
  }

  @Post("work-items")
  create(@Body() input: CreateFactoryWorkItemInput) {
    return this.orchestrator.createWorkItem(input);
  }

  @Post("work-items/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() input: ApproveFactoryWorkItemInput,
  ) {
    return this.orchestrator.approve(id, input);
  }

  @Post("work-items/:id/execute")
  execute(@Param("id") id: string) {
    return this.orchestrator.execute(id);
  }

  @Post("work-items/:id/certify")
  certify(
    @Param("id") id: string,
    @Body("approvedBy") approvedBy: string,
  ) {
    return this.orchestrator.certify(id, approvedBy);
  }

  @Get("analytics")
  analytics() {
    return this.orchestrator.analytics();
  }

  @Get("resources")
  resources() {
    return this.orchestrator.resourcesSnapshot();
  }

  @Get("telemetry")
  telemetry() {
    return this.orchestrator.telemetryEvents();
  }
}
