import { Injectable } from "@nestjs/common";
import { CoreFlowBudgetService } from "./core-flow-budget.service";
import { CoreFlowChargebackService } from "./core-flow-chargeback.service";
import { CoreFlowPricingPolicyService } from "./core-flow-pricing-policy.service";
import { CoreFlowUnitEconomicsService } from "./core-flow-unit-economics.service";
import { CoreFlowCostService } from "./core-flow-cost.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowEconomicsService {
  constructor(
    private readonly budgets: CoreFlowBudgetService,
    private readonly chargebacks: CoreFlowChargebackService,
    private readonly pricing: CoreFlowPricingPolicyService,
    private readonly unitEconomics: CoreFlowUnitEconomicsService,
    private readonly costs: CoreFlowCostService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  settle(executionId: string, dto: any = {}) {
    const price = this.pricing.calculate(
      String(dto?.flow ?? "unknown"),
      Number(dto?.units ?? 1),
      Boolean(dto?.surge),
    );

    const costRecord = this.costs.record(
      executionId,
      String(dto?.flow ?? "unknown"),
      Number(dto?.units ?? 1),
      Number(dto?.unitCost ?? 0),
      price.currency,
    );

    const economics = this.unitEconomics.calculate(
      String(dto?.flow ?? "unknown"),
      price.amount,
      costRecord.totalCost,
    );

    const chargeback = this.chargebacks.record({
      executionId,
      flow: dto?.flow,
      tenantId: dto?.tenantId,
      organizationId: dto?.organizationId,
      amount: price.amount,
      currency: price.currency,
      category: dto?.category ?? "execution",
    });

    if (dto?.budgetId) {
      this.budgets.consume(dto.budgetId, costRecord.totalCost);
    }

    const audit = this.audit.write(
      executionId,
      "economics.settled",
      {
        price: price.amount,
        cost: costRecord.totalCost,
        margin: economics.margin,
      },
      String(dto?.actor ?? "system"),
    );

    return {
      price,
      cost: costRecord,
      economics,
      chargeback,
      audit,
      settledAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      budgets: this.budgets.dashboard(),
      chargebacks: this.chargebacks.dashboard(),
      unitEconomics: this.unitEconomics.dashboard(),
      pricingPolicies: this.pricing.findAll(),
      costs: this.costs.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
