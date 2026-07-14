import { Injectable } from "@nestjs/common";
import { EnterpriseCostOptimizerService } from "./enterprise-cost-optimizer.service";
import { EnterpriseDemandForecastService } from "./enterprise-demand-forecast.service";
import { EnterpriseOptimizationRecommendationService } from "./enterprise-optimization-recommendation.service";
import { EnterprisePerformanceOptimizerService } from "./enterprise-performance-optimizer.service";
import { EnterpriseWorkloadTelemetryService } from "./enterprise-workload-telemetry.service";

@Injectable()
export class EnterpriseOptimizationIntelligenceService {
  constructor(
    private readonly telemetry: EnterpriseWorkloadTelemetryService,
    private readonly forecasting: EnterpriseDemandForecastService,
    private readonly performance: EnterprisePerformanceOptimizerService,
    private readonly cost: EnterpriseCostOptimizerService,
    private readonly recommendations: EnterpriseOptimizationRecommendationService,
  ) {}

  analyze(source = "avos-enterprise-api", currentUnits = 2) {
    if (!this.telemetry.latest(source)) {
      this.telemetry.record({
        source,
        requestsPerMinute: 180,
        cpuPercent: 58,
        memoryPercent: 62,
        errorRate: 0.4,
      });
    }

    const forecast = this.forecasting.forecast(source, 60);
    const performance = this.performance.evaluate(source);
    const cost = this.cost.evaluate(source, currentUnits);

    const recommendation = this.recommendations.create({
      category: forecast.predictedCpuPercent > 70 ? "CAPACITY" : "PERFORMANCE",
      title: "Predictive runtime optimization",
      action:
        forecast.predictedCpuPercent > 70
          ? "increase-runtime-capacity"
          : "maintain-and-tune-runtime",
      expectedImpact: Math.max(10, 100 - performance.score),
    });

    const applied = this.recommendations.apply(recommendation.id);

    return {
      success: true,
      status: "COMPLETED",
      source,
      forecast,
      performance,
      cost,
      recommendation: applied,
      completedAt: new Date().toISOString(),
    };
  }
}