import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowChangeService } from "./core-flow-change.service";
import { CoreFlowImpactService } from "./core-flow-impact.service";
import { CoreFlowReleaseGateService } from "./core-flow-release-gate.service";
import { CoreFlowRollbackPlanService } from "./core-flow-rollback-plan.service";
import { CoreFlowChangeGovernanceService } from "./core-flow-change-governance.service";

@Controller("core-flow-change-governance")
export class CoreFlowChangeController {
  constructor(
    private readonly changes: CoreFlowChangeService,
    private readonly impact: CoreFlowImpactService,
    private readonly gates: CoreFlowReleaseGateService,
    private readonly rollbackPlans: CoreFlowRollbackPlanService,
    private readonly governance: CoreFlowChangeGovernanceService,
  ) {}

  @Post("changes")
  createChange(@Body() dto: any) {
    return this.changes.create(dto);
  }

  @Get("changes")
  changesList(@Query() query: any) {
    return this.changes.findAll(query);
  }

  @Post("changes/:id/evaluate")
  evaluateChange(@Param("id") id: string, @Body() dto: any) {
    return this.governance.evaluate(id, dto);
  }

  @Post("changes/:id/approve")
  approveChange(@Param("id") id: string) {
    return this.governance.approve(id);
  }

  @Post("changes/:id/schedule")
  scheduleChange(@Param("id") id: string) {
    return this.changes.schedule(id);
  }

  @Post("changes/:id/execute")
  executeChange(@Param("id") id: string) {
    return this.changes.execute(id);
  }

  @Post("changes/:id/rollback")
  rollbackChange(@Param("id") id: string) {
    return this.changes.rollback(id);
  }

  @Get("impacts")
  impacts(@Query("changeId") changeId?: string) {
    return this.impact.findAll(changeId);
  }

  @Get("gates")
  gateList(@Query("changeId") changeId?: string) {
    return this.gates.findAll(changeId);
  }

  @Post("gates/:id/pass")
  passGate(@Param("id") id: string, @Body() dto: any) {
    return this.gates.pass(id, dto?.reason);
  }

  @Post("gates/:id/fail")
  failGate(@Param("id") id: string, @Body() dto: any) {
    return this.gates.fail(id, dto?.reason);
  }

  @Post("gates/:id/waive")
  waiveGate(@Param("id") id: string, @Body() dto: any) {
    return this.gates.waive(id, dto?.reason);
  }

  @Get("rollback-plans")
  rollbackPlanList(@Query("changeId") changeId?: string) {
    return this.rollbackPlans.findAll(changeId);
  }

  @Post("rollback-plans/:id/test")
  testRollbackPlan(@Param("id") id: string) {
    return this.rollbackPlans.test(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.governance.dashboard();
  }
}
