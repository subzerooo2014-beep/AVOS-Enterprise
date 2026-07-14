import { Injectable } from '@nestjs/common';
import { PortfolioInitiative } from './enterprise-strategic-governance.types';

@Injectable()
export class PortfolioGovernanceEngineService {
  rank(initiatives: PortfolioInitiative[]) {
    return [...initiatives]
      .map((initiative) => {
        const valueEfficiency =
          initiative.cost === 0
            ? initiative.expectedValue
            : initiative.expectedValue / initiative.cost;

        const governanceScore =
          initiative.strategicFit * 0.45 +
          Math.min(100, valueEfficiency * 10) * 0.35 +
          (100 - initiative.riskScore) * 0.2;

        return {
          ...initiative,
          governanceScore: Math.round(governanceScore),
          valueEfficiency,
        };
      })
      .sort(
        (left, right) => right.governanceScore - left.governanceScore,
      );
  }

  select(
    initiatives: PortfolioInitiative[],
    budget: number,
  ): PortfolioInitiative[] {
    let remainingBudget = budget;
    const selected: PortfolioInitiative[] = [];

    for (const initiative of this.rank(initiatives)) {
      if (initiative.cost <= remainingBudget) {
        selected.push(initiative);
        remainingBudget -= initiative.cost;
      }
    }

    return selected;
  }
}