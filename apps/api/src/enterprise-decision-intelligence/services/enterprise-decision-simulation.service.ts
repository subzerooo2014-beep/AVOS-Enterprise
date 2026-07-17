import { Injectable } from "@nestjs/common";
import { DecisionOption, DecisionSimulationResult } from "../contracts/enterprise-decision-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionSimulationService {
  simulate(options: DecisionOption[]): DecisionSimulationResult[] {
    return options.map(option => {
      const projectedBenefit = option.expectedBenefit * (option.confidence / 100);
      const projectedScore = projectedBenefit - option.expectedCost - option.risk + option.confidence;
      return {
        optionId: option.id,
        projectedScore: this.round(projectedScore),
        projectedBenefit: this.round(projectedBenefit),
        projectedCost: this.round(option.expectedCost),
        projectedRisk: this.round(option.risk),
        assumptions: ["Expected benefit is confidence-adjusted.", "Cost and risk are direct penalties.", "Simulation is deterministic and auditable."]
      };
    });
  }
  private round(value: number): number { return Math.round(value * 100) / 100; }
}