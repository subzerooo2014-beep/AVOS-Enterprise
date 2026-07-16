import { Module } from "@nestjs/common";
import { EnterpriseStrategicPlanningSimulationPlatformController } from "./enterprise-strategic-planning-simulation-platform.controller";
import { PortfolioPrioritizationService } from "./portfolio-prioritization.service";
import { ScenarioPlanningEngineService } from "./scenario-planning-engine.service";
import { StrategicPlanningAnalyticsService } from "./strategic-planning-analytics.service";
import { StrategicRiskSimulationService } from "./strategic-risk-simulation.service";
import { StrategyExecutionTrackerService } from "./strategy-execution-tracker.service";
import { StrategyRegistryService } from "./strategy-registry.service";

@Module({
  controllers: [EnterpriseStrategicPlanningSimulationPlatformController],
  providers: [
    PortfolioPrioritizationService,
    ScenarioPlanningEngineService,
    StrategicPlanningAnalyticsService,
    StrategicRiskSimulationService,
    StrategyExecutionTrackerService,
    StrategyRegistryService,
  ],
  exports: [
    PortfolioPrioritizationService,
    ScenarioPlanningEngineService,
    StrategicPlanningAnalyticsService,
    StrategicRiskSimulationService,
    StrategyExecutionTrackerService,
    StrategyRegistryService,
  ],
})
export class EnterpriseStrategicPlanningSimulationPlatformModule {}
