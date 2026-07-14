import { Module } from "@nestjs/common";
import { EnterpriseDependencyGraphService } from "./enterprise-dependency-graph.service";
import { EnterpriseE9Controller } from "./enterprise-e9.controller";
import { EnterpriseE9OrchestratorService } from "./enterprise-e9-orchestrator.service";
import { EnterpriseExecutionWaveService } from "./enterprise-execution-wave.service";
import { EnterprisePortfolioPrioritizationService } from "./enterprise-portfolio-prioritization.service";
import { EnterpriseStrategicInitiativeService } from "./enterprise-strategic-initiative.service";
import { EnterpriseStrategyGovernanceService } from "./enterprise-strategy-governance.service";
import { EnterpriseStrategyOrchestratorService } from "./enterprise-strategy-orchestrator.service";

@Module({
  controllers: [EnterpriseE9Controller],
  providers: [
    EnterpriseStrategicInitiativeService,
    EnterpriseDependencyGraphService,
    EnterprisePortfolioPrioritizationService,
    EnterpriseExecutionWaveService,
    EnterpriseStrategyGovernanceService,
    EnterpriseStrategyOrchestratorService,
    EnterpriseE9OrchestratorService,
  ],
  exports: [
    EnterpriseStrategicInitiativeService,
    EnterpriseDependencyGraphService,
    EnterprisePortfolioPrioritizationService,
    EnterpriseExecutionWaveService,
    EnterpriseStrategyGovernanceService,
    EnterpriseStrategyOrchestratorService,
    EnterpriseE9OrchestratorService,
  ],
})
export class EnterpriseE9Module {}