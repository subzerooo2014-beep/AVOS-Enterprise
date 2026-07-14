import { Body, Controller, Get, Post } from '@nestjs/common';
import { PerformanceAnalysisDto } from './dto/performance-analysis.dto';
import { ValueAnalysisDto } from './dto/value-analysis.dto';
import { OptimizationAnalysisDto } from './dto/optimization-analysis.dto';
import { BusinessPerformanceIntelligenceService } from './business-performance-intelligence.service';
import { EnterpriseValueIntelligenceEngineService } from './enterprise-value-intelligence-engine.service';
import { EnterpriseBottleneckAnalyzerService } from './enterprise-bottleneck-analyzer.service';
import { ResourceEfficiencyOptimizerService } from './resource-efficiency-optimizer.service';
import { EnterpriseOptimizationDashboardService } from './enterprise-optimization-dashboard.service';
import { ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES } from './enterprise-value-optimization.types';

@Controller('enterprise-value-optimization')
export class EnterpriseValueOptimizationController {
  constructor(
    private readonly performance: BusinessPerformanceIntelligenceService,
    private readonly value: EnterpriseValueIntelligenceEngineService,
    private readonly bottlenecks: EnterpriseBottleneckAnalyzerService,
    private readonly resources: ResourceEfficiencyOptimizerService,
    private readonly dashboard: EnterpriseOptimizationDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle G — Enterprise Value, Performance & Continuous Optimization',
      count: ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES.length,
      capabilities: ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES,
    };
  }

  @Post('performance/analyze')
  analyzePerformance(@Body() input: PerformanceAnalysisDto) {
    return this.performance.analyze(input.metrics);
  }

  @Post('value/analyze')
  analyzeValue(@Body() input: ValueAnalysisDto) {
    return this.value.analyze(input.costs, input.revenues);
  }

  @Post('optimization/analyze')
  analyzeOptimization(@Body() input: OptimizationAnalysisDto) {
    return {
      bottlenecks: this.bottlenecks.analyze(input.stages),
      resources: this.resources.optimize(input.resources),
    };
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}