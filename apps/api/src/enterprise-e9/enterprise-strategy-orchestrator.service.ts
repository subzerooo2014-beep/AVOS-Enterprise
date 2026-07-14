import { Injectable } from "@nestjs/common";
import { EnterpriseExecutionWaveService } from "./enterprise-execution-wave.service";
import { EnterprisePortfolioPrioritizationService } from "./enterprise-portfolio-prioritization.service";
import { EnterpriseStrategicInitiativeService } from "./enterprise-strategic-initiative.service";
import { EnterpriseStrategyGovernanceService } from "./enterprise-strategy-governance.service";

@Injectable()
export class EnterpriseStrategyOrchestratorService {
  constructor(
    private readonly initiatives: EnterpriseStrategicInitiativeService,
    private readonly portfolio: EnterprisePortfolioPrioritizationService,
    private readonly waves: EnterpriseExecutionWaveService,
    private readonly governance: EnterpriseStrategyGovernanceService,
  ) {}

  run() {
    const wave = this.waves.generate("AVOS strategic execution wave");
    const governance = this.governance.evaluate(wave);

    if (governance.approved) {
      for (const initiativeId of wave.initiativeIds) {
        this.initiatives.activate(initiativeId);
      }
    }

    return {
      success: governance.approved,
      status: governance.approved ? "APPROVED" : "BLOCKED",
      wave,
      governance,
      portfolioValueScore: this.portfolio.portfolioValueScore(),
      completedAt: new Date().toISOString(),
    };
  }
}