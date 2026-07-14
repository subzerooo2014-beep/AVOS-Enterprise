import { Module } from '@nestjs/common';
import { EnterpriseValueOptimizationController } from './enterprise-value-optimization.controller';
import { EnterpriseValueIntelligenceEngineService } from './enterprise-value-intelligence-engine.service';
import { BusinessPerformanceIntelligenceService } from './business-performance-intelligence.service';
import { ContinuousOptimizationEngineService } from './continuous-optimization-engine.service';
import { EnterpriseBottleneckAnalyzerService } from './enterprise-bottleneck-analyzer.service';
import { ResourceEfficiencyOptimizerService } from './resource-efficiency-optimizer.service';
import { EnterpriseCostIntelligenceService } from './enterprise-cost-intelligence.service';
import { RevenueIntelligenceEngineService } from './revenue-intelligence-engine.service';
import { ProfitabilityIntelligenceService } from './profitability-intelligence.service';
import { EnterpriseRoiIntelligenceService } from './enterprise-roi-intelligence.service';
import { EnterpriseValueForecastEngineService } from './enterprise-value-forecast-engine.service';
import { PerformanceBenchmarkEngineService } from './performance-benchmark-engine.service';
import { EnterpriseValueOptimizationOrchestratorService } from './enterprise-value-optimization-orchestrator.service';
import { EnterpriseOptimizationDashboardService } from './enterprise-optimization-dashboard.service';

@Module({
  controllers: [EnterpriseValueOptimizationController],
  providers: [
    EnterpriseValueIntelligenceEngineService,
    BusinessPerformanceIntelligenceService,
    ContinuousOptimizationEngineService,
    EnterpriseBottleneckAnalyzerService,
    ResourceEfficiencyOptimizerService,
    EnterpriseCostIntelligenceService,
    RevenueIntelligenceEngineService,
    ProfitabilityIntelligenceService,
    EnterpriseRoiIntelligenceService,
    EnterpriseValueForecastEngineService,
    PerformanceBenchmarkEngineService,
    EnterpriseValueOptimizationOrchestratorService,
    EnterpriseOptimizationDashboardService,
  ],
  exports: [
    EnterpriseValueIntelligenceEngineService,
    BusinessPerformanceIntelligenceService,
    ContinuousOptimizationEngineService,
    EnterpriseBottleneckAnalyzerService,
    ResourceEfficiencyOptimizerService,
    EnterpriseCostIntelligenceService,
    RevenueIntelligenceEngineService,
    ProfitabilityIntelligenceService,
    EnterpriseRoiIntelligenceService,
    EnterpriseValueForecastEngineService,
    PerformanceBenchmarkEngineService,
    EnterpriseValueOptimizationOrchestratorService,
    EnterpriseOptimizationDashboardService,
  ],
})
export class EnterpriseValueOptimizationModule {}