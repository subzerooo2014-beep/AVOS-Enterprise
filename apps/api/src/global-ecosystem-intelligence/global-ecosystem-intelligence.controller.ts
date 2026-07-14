import { Body, Controller, Get, Post } from '@nestjs/common';
import { PartnerIntelligenceDto } from './dto/partner-intelligence.dto';
import { ExternalIntelligenceDto } from './dto/external-intelligence.dto';
import { MarketplaceOpportunityAnalysisDto } from './dto/marketplace-opportunity.dto';
import { EnterprisePartnerIntelligenceService } from './enterprise-partner-intelligence.service';
import { ExternalIntelligenceFusionEngineService } from './external-intelligence-fusion-engine.service';
import { MarketplaceIntelligenceCoordinatorService } from './marketplace-intelligence-coordinator.service';
import { EcosystemIntelligenceDashboardService } from './ecosystem-intelligence-dashboard.service';
import { GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES } from './global-ecosystem-intelligence.types';

@Controller('global-ecosystem-intelligence')
export class GlobalEcosystemIntelligenceController {
  constructor(
    private readonly partners: EnterprisePartnerIntelligenceService,
    private readonly external: ExternalIntelligenceFusionEngineService,
    private readonly marketplace: MarketplaceIntelligenceCoordinatorService,
    private readonly dashboard: EcosystemIntelligenceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle K — Enterprise Global Ecosystem & External Intelligence',
      count: GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES.length,
      capabilities: GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES,
    };
  }

  @Post('partners/analyze')
  analyzePartners(@Body() input: PartnerIntelligenceDto) {
    return this.partners.evaluate(input.partners);
  }

  @Post('external/fuse')
  fuseExternalIntelligence(@Body() input: ExternalIntelligenceDto) {
    return this.external.fuse(input.signals);
  }

  @Post('marketplace/rank')
  rankMarketplace(
    @Body() input: MarketplaceOpportunityAnalysisDto,
  ) {
    return this.marketplace.rank(input.opportunities);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}