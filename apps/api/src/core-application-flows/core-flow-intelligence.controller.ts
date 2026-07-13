import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowIntelligenceService } from "./core-flow-intelligence.service";
import { CoreFlowAnomalyService } from "./core-flow-anomaly.service";
import { CoreFlowRecommendationService } from "./core-flow-recommendation.service";
import { CoreFlowForecastService } from "./core-flow-forecast.service";
import { CoreFlowOptimizationService } from "./core-flow-optimization.service";
import { CoreFlowLearningService } from "./core-flow-learning.service";

@Controller("core-flow-intelligence")
export class CoreFlowIntelligenceController {
  constructor(
    private readonly intelligence: CoreFlowIntelligenceService,
    private readonly anomalies: CoreFlowAnomalyService,
    private readonly recommendations: CoreFlowRecommendationService,
    private readonly forecasts: CoreFlowForecastService,
    private readonly optimizations: CoreFlowOptimizationService,
    private readonly learning: CoreFlowLearningService,
  ) {}

  @Post("executions/:id/analyze")
  analyze(@Param("id") id: string, @Body() dto: any) {
    return this.intelligence.analyze(id, dto);
  }

  @Get("anomalies")
  anomalyList(@Query() query: any) {
    return this.anomalies.findAll(query);
  }

  @Get("recommendations")
  recommendationList(@Query() query: any) {
    return this.recommendations.findAll(query);
  }

  @Post("forecasts/:flow")
  forecast(@Param("flow") flow: string, @Body() dto: any) {
    return this.intelligence.forecast(flow, dto);
  }

  @Get("forecasts")
  forecastList(@Query("flow") flow?: string) {
    return this.forecasts.findAll(flow);
  }

  @Post("optimizations/:flow")
  optimize(@Param("flow") flow: string, @Body() dto: any) {
    return this.intelligence.optimize(flow, dto);
  }

  @Get("optimizations")
  optimizationList() {
    return this.optimizations.findAll();
  }

  @Post("optimizations/:id/approve")
  approveOptimization(@Param("id") id: string) {
    return this.optimizations.approve(id);
  }

  @Post("optimizations/:id/execute")
  executeOptimization(@Param("id") id: string) {
    return this.optimizations.execute(id);
  }

  @Post("learning/signals")
  recordSignal(@Body() dto: any) {
    return this.learning.record(
      dto?.flow,
      dto?.signal,
      dto?.value,
      dto?.metadata ?? {},
    );
  }

  @Get("learning/:flow/profile")
  learningProfile(@Param("flow") flow: string) {
    return this.learning.profile(flow);
  }

  @Get("dashboard")
  dashboard() {
    return this.intelligence.dashboard();
  }
}
