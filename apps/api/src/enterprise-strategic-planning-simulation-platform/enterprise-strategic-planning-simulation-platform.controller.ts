import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PortfolioPrioritizationService } from "./portfolio-prioritization.service";
import { ScenarioPlanningEngineService } from "./scenario-planning-engine.service";
import { StrategicPlanningAnalyticsService } from "./strategic-planning-analytics.service";
import { StrategicRiskSimulationService } from "./strategic-risk-simulation.service";
import { StrategyExecutionTrackerService } from "./strategy-execution-tracker.service";
import { StrategyRegistryService } from "./strategy-registry.service";
import type { StrategicPlanRecord } from "./enterprise-strategic-planning-simulation.types";

@Controller("enterprise-strategic-planning-simulation-platform")
export class EnterpriseStrategicPlanningSimulationPlatformController {
  constructor(
    private readonly analytics: StrategicPlanningAnalyticsService,
    private readonly strategies: StrategyRegistryService,
    private readonly scenarios: ScenarioPlanningEngineService,
    private readonly portfolio: PortfolioPrioritizationService,
    private readonly execution: StrategyExecutionTrackerService,
    private readonly risk: StrategicRiskSimulationService,
  ) {}

  @Get("status")
  status() {
    return this.analytics.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.analytics.diagnostics();
  }

  @Post("plans")
  upsertPlan(
    @Body()
    body: Omit<StrategicPlanRecord, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      plan: this.strategies.upsert(body),
    };
  }

  @Post("plans/:id/scenarios")
  createScenario(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      variables: Record<string, number>;
      probability: number;
    },
  ) {
    return {
      success: true,
      scenario: this.scenarios.createScenario(
        id,
        body.name,
        body.variables,
        body.probability,
      ),
    };
  }

  @Post("scenarios/:id/forecast")
  forecast(
    @Param("id") id: string,
    @Body() body: { confidence: number },
  ) {
    return {
      success: true,
      forecast: this.scenarios.forecast(id, body.confidence),
    };
  }

  @Post("plans/:id/initiatives")
  registerInitiative(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      strategicValue: number;
      cost: number;
      risk: number;
      urgency: number;
    },
  ) {
    return {
      success: true,
      initiative: this.portfolio.register(
        id,
        body.name,
        body.strategicValue,
        body.cost,
        body.risk,
        body.urgency,
      ),
    };
  }

  @Post("initiatives/:id/approve")
  approveInitiative(@Param("id") id: string) {
    return {
      success: true,
      initiative: this.portfolio.approve(id),
    };
  }

  @Post("initiatives/:id/execution")
  updateExecution(
    @Param("id") id: string,
    @Body()
    body: {
      progressPercent: number;
      milestone: string;
      status: "ON_TRACK" | "AT_RISK" | "BLOCKED" | "COMPLETED";
    },
  ) {
    return {
      success: true,
      execution: this.execution.update(
        id,
        body.progressPercent,
        body.milestone,
        body.status,
      ),
    };
  }

  @Post("scenarios/:id/risk-simulate")
  simulateRisk(
    @Param("id") id: string,
    @Body()
    body: {
      downsideFactor: number;
      upsideFactor: number;
    },
  ) {
    return {
      success: true,
      simulation: this.risk.simulate(
        id,
        body.downsideFactor,
        body.upsideFactor,
      ),
    };
  }
}
