import { Injectable } from "@nestjs/common";
import { EnterpriseStrategicInitiative } from "./enterprise-e9.types";
import { EnterpriseStrategicInitiativeService } from "./enterprise-strategic-initiative.service";

@Injectable()
export class EnterprisePortfolioPrioritizationService {
  constructor(
    private readonly initiatives: EnterpriseStrategicInitiativeService,
  ) {}

  rank(): EnterpriseStrategicInitiative[] {
    return this.initiatives
      .list()
      .sort((a, b) => this.score(b) - this.score(a));
  }

  portfolioValueScore(): number {
    const ranked = this.rank();
    if (ranked.length === 0) {
      return 0;
    }

    const total = ranked.reduce((sum, item) => sum + this.score(item), 0);
    return Math.round(total / ranked.length);
  }

  private score(item: EnterpriseStrategicInitiative): number {
    return Math.round(
      item.valueScore * 0.5 +
        item.urgencyScore * 0.35 -
        item.riskScore * 0.15 -
        item.dependencyCount * 2,
    );
  }
}