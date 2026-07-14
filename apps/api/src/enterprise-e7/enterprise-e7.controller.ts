import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseCapacityPlannerService } from "./enterprise-capacity-planner.service";
import { EnterpriseDemandForecastService } from "./enterprise-demand-forecast.service";
import { EnterpriseE7OrchestratorService } from "./enterprise-e7-orchestrator.service";
import { EnterpriseOptimizationRecommendationService } from "./enterprise-optimization-recommendation.service";
import { EnterpriseWorkloadTelemetryService } from "./enterprise-workload-telemetry.service";

@Controller("enterprise-e7")
export class EnterpriseE7Controller {
  constructor(
    private readonly orchestrator: EnterpriseE7OrchestratorService,
    private readonly telemetry: EnterpriseWorkloadTelemetryService,
    private readonly forecasting: EnterpriseDemandForecastService,
    private readonly capacity: EnterpriseCapacityPlannerService,
    private readonly recommendations: EnterpriseOptimizationRecommendationService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("telemetry")
  recordTelemetry(
    @Body()
    body: {
      source?: string;
      requestsPerMinute?: number;
      cpuPercent?: number;
      memoryPercent?: number;
      errorRate?: number;
    },
  ) {
    return this.telemetry.record(body || {});
  }

  @Get("telemetry")
  listTelemetry() {
    return this.telemetry.list();
  }

  @Post("forecast")
  forecast(
    @Body()
    body: {
      source?: string;
      horizonMinutes?: number;
    },
  ) {
    return this.forecasting.forecast(
      body?.source || "avos-enterprise-api",
      body?.horizonMinutes || 60,
    );
  }

  @Post("capacity")
  capacityPlan(
    @Body()
    body: {
      source?: string;
      currentUnits?: number;
    },
  ) {
    return this.capacity.plan(
      body?.source || "avos-enterprise-api",
      body?.currentUnits || 2,
    );
  }

  @Get("recommendations")
  listRecommendations() {
    return this.recommendations.list();
  }

  @Post("recommendations/:id/apply")
  applyRecommendation(@Param("id") id: string) {
    return this.recommendations.apply(id);
  }

  @Get("snapshot")
  snapshot() {
    return this.orchestrator.snapshot();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();
    const snapshot = this.orchestrator.snapshot();

    return {
      success: result.success,
      system: "AVOS Enterprise Mega Bundle E7",
      integrationStatus: "running",
      optimizationStatus: result.status,
      forecastTrend: result.forecast.trend,
      capacityRecommended:
        result.cost.optimizedMonthlyCost !== result.cost.currentMonthlyCost,
      performanceScore: result.performance.score,
      costEfficiencyScore: result.cost.costEfficiencyScore,
      recommendationStatus: result.recommendation.status,
      optimizationReadiness: snapshot.optimizationReadiness,
      capabilities: 7,
    };
  }
}