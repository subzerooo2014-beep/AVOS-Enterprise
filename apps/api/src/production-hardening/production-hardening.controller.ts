import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecurityControlDto } from './dto/security-control.dto';
import { PerformanceMetricDto } from './dto/performance-metric.dto';
import { ProductionConfigurationDto } from './dto/production-configuration.dto';
import { SecurityHardeningEngineService } from './security-hardening-engine.service';
import { PerformanceProfilingEngineService } from './performance-profiling-engine.service';
import { ProductionConfigurationAuditEngineService } from './production-configuration-audit-engine.service';
import { ProductionHardeningDashboardService } from './production-hardening-dashboard.service';
import { PRODUCTION_HARDENING_CAPABILITIES } from './production-hardening.types';

@Controller('production-hardening')
export class ProductionHardeningController {
  constructor(
    private readonly security: SecurityHardeningEngineService,
    private readonly performance: PerformanceProfilingEngineService,
    private readonly configuration: ProductionConfigurationAuditEngineService,
    private readonly dashboard: ProductionHardeningDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Production Hardening Mega Bundle',
      count: PRODUCTION_HARDENING_CAPABILITIES.length,
      capabilities: PRODUCTION_HARDENING_CAPABILITIES,
    };
  }

  @Post('security/audit')
  auditSecurity(@Body() input: { controls: SecurityControlDto[] }) {
    return this.security.audit(input.controls);
  }

  @Post('performance/analyze')
  analyzePerformance(
    @Body() input: { metrics: PerformanceMetricDto[] },
  ) {
    return this.performance.analyze(input.metrics);
  }

  @Post('configuration/audit')
  auditConfiguration(
    @Body() input: ProductionConfigurationDto,
  ) {
    return this.configuration.audit(input);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}