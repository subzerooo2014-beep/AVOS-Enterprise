import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AutonomousEnterpriseExecutionService } from "./autonomous-enterprise-execution.service";
import { AutonomousExecutionPlan } from "./autonomous-enterprise-execution.types";

@Controller("autonomous-enterprise-execution")
export class AutonomousEnterpriseExecutionController {
  constructor(
    private readonly execution: AutonomousEnterpriseExecutionService,
  ) {}

  @Get()
  framework() {
    return this.execution.framework();
  }

  @Post("plans")
  createPlan(
    @Body()
    input: Omit<
      AutonomousExecutionPlan,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.execution.createPlan(input);
  }

  @Get("plans")
  listPlans(@Query("tenantId") tenantId?: string) {
    return this.execution.listPlans(tenantId);
  }

  @Post("plans/:id/evaluate")
  evaluatePolicy(@Param("id") id: string) {
    return this.execution.evaluatePolicy(id);
  }

  @Post("plans/:id/validate")
  validatePlan(@Param("id") id: string) {
    return this.execution.validatePlan(id);
  }

  @Patch("plans/:id/approval")
  approvePlan(
    @Param("id") id: string,
    @Body() body: { approved: boolean },
  ) {
    return this.execution.approvePlan(id, body.approved);
  }

  @Post("plans/:id/runs")
  startRun(@Param("id") id: string) {
    return this.execution.startRun(id);
  }

  @Post("runs/:id/complete-step")
  completeStep(
    @Param("id") id: string,
    @Body()
    input: {
      stepSequence: number;
      spentAmount: number;
      evidence: string;
    },
  ) {
    return this.execution.completeStep(id, input);
  }

  @Post("runs/:id/fail")
  failRun(
    @Param("id") id: string,
    @Body() input: { failedStep: number; evidence: string },
  ) {
    return this.execution.failRun(id, input);
  }

  @Post("runs/:id/rollback")
  rollbackRun(
    @Param("id") id: string,
    @Body() body: { evidence: string },
  ) {
    return this.execution.rollbackRun(id, body.evidence);
  }

  @Get("command-center")
  commandCenter() {
    return this.execution.commandCenter();
  }
}