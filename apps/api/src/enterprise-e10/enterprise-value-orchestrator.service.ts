import { Injectable } from "@nestjs/common";
import { EnterpriseValueActionService } from "./enterprise-value-action.service";
import { EnterpriseValueGovernanceService } from "./enterprise-value-governance.service";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";
import { EnterpriseValueOutcomeService } from "./enterprise-value-outcome.service";

@Injectable()
export class EnterpriseValueOrchestratorService {
  constructor(
    private readonly opportunities: EnterpriseValueOpportunityService,
    private readonly outcomes: EnterpriseValueOutcomeService,
    private readonly actions: EnterpriseValueActionService,
    private readonly governance: EnterpriseValueGovernanceService,
  ) {}

  run() {
    const opportunity = this.opportunities.create({
      name: "AVOS enterprise value realization",
      domain: "enterprise-value",
      expectedValue: 100000,
      confidence: 92,
      timeToValueDays: 30,
      riskScore: 18,
    });

    const governance = this.governance.evaluate(opportunity);

    if (!governance.approved) {
      this.opportunities.markAtRisk(opportunity.id);
      return {
        success: false,
        status: "BLOCKED",
        opportunity,
        governance,
        completedAt: new Date().toISOString(),
      };
    }

    const action = this.actions.create(
      opportunity.id,
      "activate-value-realization-plan",
    );
    const executedAction = this.actions.execute(action.id);
    const outcome = this.outcomes.measure(opportunity.id, 93000);

    return {
      success: executedAction.executed,
      status: "REALIZED",
      opportunity: this.opportunities.get(opportunity.id),
      governance,
      action: executedAction,
      outcome,
      completedAt: new Date().toISOString(),
    };
  }
}