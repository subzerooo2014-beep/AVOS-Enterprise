import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerProfileDto } from './dto/customer-profile.dto';
import { LeadDto } from './dto/lead.dto';
import { OpportunityDto } from './dto/opportunity.dto';
import { CustomerHealthScoreEngineService } from './customer-health-score-engine.service';
import { LeadLifecycleEngineService } from './lead-lifecycle-engine.service';
import { SalesPipelineIntelligenceService } from './sales-pipeline-intelligence.service';
import { ExecutiveCrmDashboardService } from './executive-crm-dashboard.service';
import { ENTERPRISE_CRM_GROWTH_CAPABILITIES } from './enterprise-crm-growth.types';

@Controller('enterprise-crm-growth')
export class EnterpriseCrmGrowthController {
  constructor(
    private readonly health: CustomerHealthScoreEngineService,
    private readonly leads: LeadLifecycleEngineService,
    private readonly pipeline: SalesPipelineIntelligenceService,
    private readonly dashboard: ExecutiveCrmDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle W — Enterprise CRM, Customer Success & Growth Intelligence',
      count: ENTERPRISE_CRM_GROWTH_CAPABILITIES.length,
      capabilities: ENTERPRISE_CRM_GROWTH_CAPABILITIES,
    };
  }

  @Post('customers/health')
  customerHealth(@Body() input: CustomerProfileDto) {
    return this.health.score(input);
  }

  @Post('leads/qualify')
  qualifyLeads(@Body() input: { leads: LeadDto[] }) {
    return this.leads.qualify(input.leads);
  }

  @Post('pipeline/analyze')
  analyzePipeline(@Body() input: { opportunities: OpportunityDto[] }) {
    return this.pipeline.analyze(input.opportunities);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}