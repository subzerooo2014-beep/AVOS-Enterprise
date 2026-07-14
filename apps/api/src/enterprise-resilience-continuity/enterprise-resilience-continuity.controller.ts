import { Body, Controller, Get, Post } from '@nestjs/common';
import { RiskAnalysisDto } from './dto/risk-analysis.dto';
import { ContinuityAnalysisDto } from './dto/continuity-analysis.dto';
import { CrisisResponseDto } from './dto/crisis-response.dto';
import { OperationalRiskIntelligenceService } from './operational-risk-intelligence.service';
import { CriticalDependencyMapperService } from './critical-dependency-mapper.service';
import { BusinessContinuityOrchestratorService } from './business-continuity-orchestrator.service';
import { ResilienceContinuityDashboardService } from './resilience-continuity-dashboard.service';
import { ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES } from './enterprise-resilience-continuity.types';

@Controller('enterprise-resilience-continuity')
export class EnterpriseResilienceContinuityController {
  constructor(
    private readonly risk: OperationalRiskIntelligenceService,
    private readonly dependencies: CriticalDependencyMapperService,
    private readonly continuity: BusinessContinuityOrchestratorService,
    private readonly dashboard: ResilienceContinuityDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle H — Enterprise Resilience, Risk & Autonomous Continuity',
      count: ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES.length,
      capabilities: ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES,
    };
  }

  @Post('risk/analyze')
  analyzeRisk(@Body() input: RiskAnalysisDto) {
    return this.risk.assess(input.risks);
  }

  @Post('dependencies/map')
  mapDependencies(@Body() input: ContinuityAnalysisDto) {
    return this.dependencies.map(input.dependencies);
  }

  @Post('crisis/plan')
  createCrisisPlan(@Body() input: CrisisResponseDto) {
    return this.continuity.createPlan(
      {
        id: input.id,
        title: input.title,
        domain: input.domain,
        severity: input.severity,
        status: 'detected',
        detectedAt: new Date().toISOString(),
        affectedDependencies: input.affectedDependencies,
      },
      input.affectedDependencies.map((id) => ({
        id,
        name: id,
        domain: input.domain,
        criticality: 80,
        recoveryTimeObjectiveMinutes: 60,
        recoveryPointObjectiveMinutes: 15,
        dependencies: [],
      })),
    );
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}