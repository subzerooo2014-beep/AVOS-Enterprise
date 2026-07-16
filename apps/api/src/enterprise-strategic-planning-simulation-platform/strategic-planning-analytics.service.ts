import { Injectable } from "@nestjs/common";
import { PortfolioPrioritizationService } from "./portfolio-prioritization.service";
import { ScenarioPlanningEngineService } from "./scenario-planning-engine.service";
import { StrategicRiskSimulationService } from "./strategic-risk-simulation.service";
import { StrategyExecutionTrackerService } from "./strategy-execution-tracker.service";
import { StrategyRegistryService } from "./strategy-registry.service";
import type {
  StrategicPlanningHealth,
  StrategicPlanningMetrics,
} from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class StrategicPlanningAnalyticsService {
  constructor(
    private readonly strategies: StrategyRegistryService,
    private readonly scenarios: ScenarioPlanningEngineService,
    private readonly portfolio: PortfolioPrioritizationService,
    private readonly execution: StrategyExecutionTrackerService,
    private readonly risk: StrategicRiskSimulationService,
  ) {}

  metrics(): StrategicPlanningMetrics {
    return {
      plans: this.strategies.count(),
      activePlans: this.strategies.activeCount(),
      scenarios: this.scenarios.scenarioCount(),
      forecasts: this.scenarios.forecastCount(),
      initiatives: this.portfolio.count(),
      approvedInitiatives: this.portfolio.approvedCount(),
      executingInitiatives: this.portfolio.executingCount(),
      executionRecords: this.execution.count(),
      riskSimulations: this.risk.count(),
      blockedExecutions: this.execution.blockedCount(),
    };
  }

  health(): StrategicPlanningHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Strategic Planning & Simulation Platform",
      version: "1.0.0",
      status: metrics.blockedExecutions > 0 ? "DEGRADED" : "READY",
      metrics,
      components: {
        strategyRegistry: "READY",
        scenarioPlanning: "READY",
        strategicForecasting: "READY",
        portfolioPrioritization: "READY",
        riskSimulation: "READY",
        executionTracking: "READY",
        strategicAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      plans: this.strategies.list(),
      scenarios: this.scenarios.scenariosList(),
      forecasts: this.scenarios.forecastsList(),
      initiatives: this.portfolio.list(),
      executions: this.execution.list(),
      riskSimulations: this.risk.list(),
    };
  }
}
