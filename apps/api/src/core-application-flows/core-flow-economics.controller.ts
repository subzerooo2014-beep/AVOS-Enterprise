import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowBudgetService } from "./core-flow-budget.service";
import { CoreFlowChargebackService } from "./core-flow-chargeback.service";
import { CoreFlowPricingPolicyService } from "./core-flow-pricing-policy.service";
import { CoreFlowUnitEconomicsService } from "./core-flow-unit-economics.service";
import { CoreFlowEconomicsService } from "./core-flow-economics.service";

@Controller("core-flow-economics")
export class CoreFlowEconomicsController {
  constructor(
    private readonly budgets: CoreFlowBudgetService,
    private readonly chargebacks: CoreFlowChargebackService,
    private readonly pricing: CoreFlowPricingPolicyService,
    private readonly unitEconomics: CoreFlowUnitEconomicsService,
    private readonly economics: CoreFlowEconomicsService,
  ) {}

  @Post("budgets")
  createBudget(@Body() dto: any) {
    return this.budgets.create(dto);
  }

  @Get("budgets")
  budgetsList(@Query() query: any) {
    return this.budgets.findAll(query);
  }

  @Post("budgets/:id/activate")
  activateBudget(@Param("id") id: string) {
    return this.budgets.activate(id);
  }

  @Post("budgets/:id/reserve")
  reserveBudget(@Param("id") id: string, @Body() dto: any) {
    return this.budgets.reserve(id, dto?.amount);
  }

  @Post("budgets/:id/consume")
  consumeBudget(@Param("id") id: string, @Body() dto: any) {
    return this.budgets.consume(id, dto?.amount);
  }

  @Post("pricing-policies")
  createPricingPolicy(@Body() dto: any) {
    return this.pricing.create(dto);
  }

  @Get("pricing-policies")
  pricingPolicies(@Query("flow") flow?: string) {
    return this.pricing.findAll(flow);
  }

  @Post("pricing/:flow/calculate")
  calculatePrice(@Param("flow") flow: string, @Body() dto: any) {
    return this.pricing.calculate(flow, dto?.units, dto?.surge);
  }

  @Post("chargebacks")
  createChargeback(@Body() dto: any) {
    return this.chargebacks.record(dto);
  }

  @Get("chargebacks")
  chargebacksList(@Query() query: any) {
    return this.chargebacks.findAll(query);
  }

  @Post("unit-economics/:flow")
  calculateUnitEconomics(@Param("flow") flow: string, @Body() dto: any) {
    return this.unitEconomics.calculate(flow, dto?.revenue, dto?.cost);
  }

  @Get("unit-economics")
  unitEconomicsList(@Query("flow") flow?: string) {
    return this.unitEconomics.findAll(flow);
  }

  @Post("executions/:id/settle")
  settle(@Param("id") id: string, @Body() dto: any) {
    return this.economics.settle(id, dto);
  }

  @Get("dashboard")
  dashboard() {
    return this.economics.dashboard();
  }
}
