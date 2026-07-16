import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseUltimateF2Service } from "./enterprise-ultimate-f2.service";
import {
  F2Decision,
  F2Goal,
  F2Insight,
  F2Metric,
  F2Task,
} from "./enterprise-ultimate-f2.types";

@Controller("enterprise-ultimate-f2")
export class EnterpriseUltimateF2Controller {
  constructor(private readonly service: EnterpriseUltimateF2Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("metrics")
  recordMetric(
    @Body() input: Omit<F2Metric, "id" | "status" | "recordedAt">,
  ) {
    return this.service.recordMetric(input);
  }

  @Post("decisions")
  createDecision(
    @Body()
    input: Omit<F2Decision, "id" | "approved" | "executed" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createDecision(input);
  }

  @Patch("decisions/:id/approve")
  approveDecision(@Param("id") id: string) {
    return this.service.approveDecision(id);
  }

  @Post("decisions/:id/execute")
  executeDecision(@Param("id") id: string) {
    return this.service.executeDecision(id);
  }

  @Post("tasks")
  createTask(
    @Body() input: Omit<F2Task, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createTask(input);
  }

  @Patch("tasks/:id/complete")
  completeTask(@Param("id") id: string) {
    return this.service.completeTask(id);
  }

  @Post("insights")
  createInsight(
    @Body() input: Omit<F2Insight, "id" | "createdAt">,
  ) {
    return this.service.createInsight(input);
  }

  @Post("goals")
  createGoal(
    @Body()
    input: Omit<F2Goal, "id" | "progress" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createGoal(input);
  }

  @Get("executive-dashboard")
  executiveDashboard(@Query("tenantId") tenantId?: string) {
    return this.service.executiveDashboard(tenantId);
  }

  @Get("business-health/:tenantId")
  businessHealth(@Param("tenantId") tenantId: string) {
    return this.service.businessHealth(tenantId);
  }
}