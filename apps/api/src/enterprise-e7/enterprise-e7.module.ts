import { Module } from "@nestjs/common";
import { EnterpriseCapacityPlannerService } from "./enterprise-capacity-planner.service";
import { EnterpriseCostOptimizerService } from "./enterprise-cost-optimizer.service";
import { EnterpriseDemandForecastService } from "./enterprise-demand-forecast.service";
import { EnterpriseE7Controller } from "./enterprise-e7.controller";
import { EnterpriseE7OrchestratorService } from "./enterprise-e7-orchestrator.service";
import { EnterpriseOptimizationIntelligenceService } from "./enterprise-optimization-intelligence.service";
import { EnterpriseOptimizationRecommendationService } from "./enterprise-optimization-recommendation.service";
import { EnterprisePerformanceOptimizerService } from "./enterprise-performance-optimizer.service";
import { EnterpriseWorkloadTelemetryService } from "./enterprise-workload-telemetry.service";

@Module({
  controllers: [EnterpriseE7Controller],
  providers: [
    EnterpriseWorkloadTelemetryService,
    EnterpriseDemandForecastService,
    EnterpriseCapacityPlannerService,
    EnterprisePerformanceOptimizerService,
    EnterpriseCostOptimizerService,
    EnterpriseOptimizationRecommendationService,
    EnterpriseOptimizationIntelligenceService,
    EnterpriseE7OrchestratorService,
  ],
  exports: [
    EnterpriseWorkloadTelemetryService,
    EnterpriseDemandForecastService,
    EnterpriseCapacityPlannerService,
    EnterprisePerformanceOptimizerService,
    EnterpriseCostOptimizerService,
    EnterpriseOptimizationRecommendationService,
    EnterpriseOptimizationIntelligenceService,
    EnterpriseE7OrchestratorService,
  ],
})
export class EnterpriseE7Module {}