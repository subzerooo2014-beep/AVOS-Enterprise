import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseValueOutcome } from "./enterprise-e10.types";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";

@Injectable()
export class EnterpriseValueOutcomeService {
  private readonly outcomes: EnterpriseValueOutcome[] = [];

  constructor(
    private readonly opportunities: EnterpriseValueOpportunityService,
  ) {}

  measure(opportunityId: string, measuredValue?: number): EnterpriseValueOutcome {
    const opportunity = this.opportunities.get(opportunityId);
    const targetValue = opportunity.expectedValue;
    const value =
      measuredValue ?? Math.round(targetValue * (opportunity.confidence / 100));
    const realizationRate =
      targetValue <= 0 ? 100 : Math.min(100, Math.round((value / targetValue) * 100));
    const leakageValue = Math.max(0, targetValue - value);

    const outcome: EnterpriseValueOutcome = {
      id: randomUUID(),
      opportunityId,
      measuredValue: value,
      targetValue,
      realizationRate,
      leakageValue,
      measuredAt: new Date().toISOString(),
    };

    this.outcomes.push(outcome);

    if (realizationRate >= 90) {
      this.opportunities.markRealized(opportunityId);
    } else if (realizationRate >= 60) {
      this.opportunities.markRealizing(opportunityId);
    } else {
      this.opportunities.markAtRisk(opportunityId);
    }

    return outcome;
  }

  list(): EnterpriseValueOutcome[] {
    return [...this.outcomes];
  }

  count(): number {
    return this.outcomes.length;
  }

  totalMeasuredValue(): number {
    return this.outcomes.reduce((sum, item) => sum + item.measuredValue, 0);
  }
}