import { Injectable } from "@nestjs/common";
import { EnterpriseValueOutcomeService } from "./enterprise-value-outcome.service";

@Injectable()
export class EnterpriseValueLeakageService {
  constructor(
    private readonly outcomes: EnterpriseValueOutcomeService,
  ) {}

  analyze() {
    const outcomes = this.outcomes.list();
    const totalTarget = outcomes.reduce((sum, item) => sum + item.targetValue, 0);
    const totalLeakage = outcomes.reduce((sum, item) => sum + item.leakageValue, 0);
    const leakageRate =
      totalTarget <= 0 ? 0 : Math.round((totalLeakage / totalTarget) * 100);

    return {
      totalTarget,
      totalLeakage,
      leakageRate,
      severity:
        leakageRate >= 40
          ? "CRITICAL"
          : leakageRate >= 25
            ? "HIGH"
            : leakageRate >= 10
              ? "MEDIUM"
              : "LOW",
      analyzedAt: new Date().toISOString(),
    };
  }
}