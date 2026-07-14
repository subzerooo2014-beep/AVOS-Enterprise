import { Injectable } from "@nestjs/common";
import { EnterpriseCapacityPlannerService } from "./enterprise-capacity-planner.service";

@Injectable()
export class EnterpriseCostOptimizerService {
  constructor(
    private readonly capacity: EnterpriseCapacityPlannerService,
  ) {}

  evaluate(source = "avos-enterprise-api", currentUnits = 2) {
    const { plan } = this.capacity.plan(source, currentUnits);
    const unitMonthlyCost = 100;
    const currentMonthlyCost = plan.currentUnits * unitMonthlyCost;
    const optimizedMonthlyCost = plan.recommendedUnits * unitMonthlyCost;
    const monthlyDelta = currentMonthlyCost - optimizedMonthlyCost;
    const score =
      monthlyDelta >= 0
        ? Math.min(100, 85 + monthlyDelta / 10)
        : Math.max(0, 85 + monthlyDelta / 20);

    return {
      source,
      currentMonthlyCost,
      optimizedMonthlyCost,
      monthlyDelta,
      costEfficiencyScore: Math.round(score),
      capacityPlanId: plan.id,
      evaluatedAt: new Date().toISOString(),
    };
  }
}