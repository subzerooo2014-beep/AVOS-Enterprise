import { Injectable } from "@nestjs/common";
import { CoreFlowAnomalyService } from "./core-flow-anomaly.service";
import { CoreFlowRecommendationService } from "./core-flow-recommendation.service";
import { CoreFlowForecastService } from "./core-flow-forecast.service";
import { CoreFlowOptimizationService } from "./core-flow-optimization.service";
import { CoreFlowLearningService } from "./core-flow-learning.service";
import { CoreFlowRiskService } from "./core-flow-risk.service";
import { CoreFlowCostService } from "./core-flow-cost.service";

@Injectable()
export class CoreFlowIntelligenceService {
  constructor(
    private readonly anomalies: CoreFlowAnomalyService,
    private readonly recommendations: CoreFlowRecommendationService,
    private readonly forecasts: CoreFlowForecastService,
    private readonly optimizations: CoreFlowOptimizationService,
    private readonly learning: CoreFlowLearningService,
    private readonly risk: CoreFlowRiskService,
    private readonly costs: CoreFlowCostService,
  ) {}

  analyze(executionId: string, dto: any = {}) {
    const anomaly = this.anomalies.detect(
      executionId,
      String(dto?.metric ?? "durationMs"),
      Number(dto?.actual ?? dto?.durationMs ?? 0),
      Number(dto?.expected ?? dto?.targetMs ?? 0),
    );

    const risk = this.risk.assess(executionId, {
      amount: dto?.amount,
      attempts: dto?.attempts,
      crossBorder: dto?.crossBorder,
      privileged: dto?.privileged,
      manualOverride: dto?.manualOverride,
    });

    const recommendations = this.recommendations.generate(executionId, {
      durationMs: dto?.durationMs,
      targetMs: dto?.targetMs,
      attempts: dto?.attempts,
      highCost: dto?.highCost,
    });

    this.learning.record(
      String(dto?.flow ?? "unknown"),
      "durationMs",
      Number(dto?.durationMs ?? 0),
      { executionId },
    );
    this.learning.record(
      String(dto?.flow ?? "unknown"),
      "riskScore",
      risk.score,
      { executionId },
    );

    return {
      executionId,
      anomaly,
      risk,
      recommendations,
      analyzedAt: new Date().toISOString(),
    };
  }

  optimize(flow: string, dto: any = {}) {
    return this.optimizations.create(
      flow,
      String(dto?.objective ?? "improve-performance-and-reliability"),
      dto?.signals ?? dto,
    );
  }

  forecast(flow: string, dto: any = {}) {
    return this.forecasts.generate(
      flow,
      Array.isArray(dto?.samples) ? dto.samples : [],
      dto?.horizon ?? "next-24h",
    );
  }

  dashboard() {
    return {
      anomalies: this.anomalies.dashboard(),
      recommendations: this.recommendations.findAll().slice(0, 25),
      forecasts: this.forecasts.findAll().slice(0, 25),
      optimizations: this.optimizations.findAll().slice(0, 25),
      learningSignals: this.learning.all().slice(0, 50),
      costs: this.costs.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
