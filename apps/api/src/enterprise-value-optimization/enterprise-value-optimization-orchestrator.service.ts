import { Injectable } from '@nestjs/common';
import {
  CostRecord,
  PerformanceMetric,
  ProcessStage,
  ResourceUsage,
  RevenueRecord,
} from './enterprise-value-optimization.types';
import { EnterpriseValueIntelligenceEngineService } from './enterprise-value-intelligence-engine.service';
import { BusinessPerformanceIntelligenceService } from './business-performance-intelligence.service';
import { EnterpriseBottleneckAnalyzerService } from './enterprise-bottleneck-analyzer.service';
import { ResourceEfficiencyOptimizerService } from './resource-efficiency-optimizer.service';
import { EnterpriseCostIntelligenceService } from './enterprise-cost-intelligence.service';
import { RevenueIntelligenceEngineService } from './revenue-intelligence-engine.service';
import { ProfitabilityIntelligenceService } from './profitability-intelligence.service';
import { EnterpriseRoiIntelligenceService } from './enterprise-roi-intelligence.service';
import { EnterpriseValueForecastEngineService } from './enterprise-value-forecast-engine.service';

@Injectable()
export class EnterpriseValueOptimizationOrchestratorService {
  constructor(
    private readonly value: EnterpriseValueIntelligenceEngineService,
    private readonly performance: BusinessPerformanceIntelligenceService,
    private readonly bottlenecks: EnterpriseBottleneckAnalyzerService,
    private readonly resources: ResourceEfficiencyOptimizerService,
    private readonly costs: EnterpriseCostIntelligenceService,
    private readonly revenue: RevenueIntelligenceEngineService,
    private readonly profitability: ProfitabilityIntelligenceService,
    private readonly roi: EnterpriseRoiIntelligenceService,
    private readonly forecast: EnterpriseValueForecastEngineService,
  ) {}

  run(input: {
    costs: CostRecord[];
    revenues: RevenueRecord[];
    metrics: PerformanceMetric[];
    resources: ResourceUsage[];
    stages: ProcessStage[];
  }) {
    const value = this.value.analyze(input.costs, input.revenues);
    const performance = this.performance.analyze(input.metrics);
    const bottlenecks = this.bottlenecks.analyze(input.stages);
    const resources = this.resources.optimize(input.resources);
    const costs = this.costs.analyze(input.costs);
    const revenue = this.revenue.analyze(input.revenues);
    const profitability = this.profitability.analyze(
      input.costs,
      input.revenues,
    );
    const roi = this.roi.calculate(costs.totalCost, revenue.totalRevenue);
    const forecast = this.forecast.forecast(
      value.grossValue,
      revenue.weightedGrowthRate,
      180,
      0.85,
    );

    return {
      value,
      performance,
      bottlenecks,
      resources,
      costs,
      revenue,
      profitability,
      roi,
      forecast,
    };
  }
}