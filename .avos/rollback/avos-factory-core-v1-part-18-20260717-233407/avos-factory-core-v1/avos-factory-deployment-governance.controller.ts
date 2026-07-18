import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryPromotionPolicyRegistryService
} from "./avos-factory-promotion-policy-registry.service";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryPromotionApprovalService
} from "./avos-factory-promotion-approval.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryDeploymentSmokeService
} from "./avos-factory-deployment-smoke.service";

@Controller("avos/factory/v1/deployment")
export class AvosFactoryDeploymentGovernanceController {
  constructor(
    private readonly policies: AvosFactoryPromotionPolicyRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly approvals: AvosFactoryPromotionApprovalService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly smoke: AvosFactoryDeploymentSmokeService
  ) {}

  @Get("policies")
  policyList() {
    return { items: this.policies.list() };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    input: Parameters<
      AvosFactoryPromotionPolicyRegistryService["register"]
    >[0]
  ) {
    return this.policies.register(input);
  }

  @Post("plans")
  createPlan(
    @Body()
    input: Parameters<AvosFactoryDeploymentPlanService["create"]>[0]
  ) {
    return this.plans.create(input);
  }

  @Get("plans")
  planList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.plans.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("plans/:id")
  getPlan(@Param("id") id: string) {
    return this.plans.get(id) ?? null;
  }

  @Post("promotions/decide")
  decidePromotion(
    @Body()
    input: Parameters<AvosFactoryPromotionApprovalService["decide"]>[0]
  ) {
    return this.approvals.decide(input);
  }

  @Get("promotions/decisions")
  decisionList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.approvals.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("executions")
  execute(
    @Body()
    input: Parameters<AvosFactoryDeploymentExecutionService["execute"]>[0]
  ) {
    return this.executions.execute(input);
  }

  @Post("executions/:id/rollback")
  rollback(
    @Param("id") id: string,
    @Body()
    body: {
      actor: string;
      reason: string;
    }
  ) {
    return this.executions.rollback({
      executionId: id,
      ...body
    });
  }

  @Get("executions")
  executionList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.executions.listExecutions(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("rollbacks")
  rollbackList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.executions.listRollbacks(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
