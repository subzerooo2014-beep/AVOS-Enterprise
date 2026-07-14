import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundationAssessmentDto } from './dto/foundation-assessment.dto';
import { ReleaseEvidenceBatchDto } from './dto/release-evidence.dto';
import { FoundationIntegrityEngineService } from './foundation-integrity-engine.service';
import { FoundationEvidenceRegistryService } from './foundation-evidence-registry.service';
import { ProductionReadinessDashboardService } from './production-readiness-dashboard.service';
import { FOUNDATION_PRODUCTION_READINESS_CAPABILITIES } from './foundation-production-readiness.types';

@Controller('foundation-production-readiness')
export class FoundationProductionReadinessController {
  constructor(
    private readonly integrity: FoundationIntegrityEngineService,
    private readonly evidence: FoundationEvidenceRegistryService,
    private readonly dashboard: ProductionReadinessDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle P — Foundation Finalization & Production Readiness',
      count: FOUNDATION_PRODUCTION_READINESS_CAPABILITIES.length,
      capabilities: FOUNDATION_PRODUCTION_READINESS_CAPABILITIES,
    };
  }

  @Post('foundation/assess')
  assessFoundation(@Body() input: FoundationAssessmentDto) {
    return this.integrity.evaluate(input.modules);
  }

  @Post('evidence/register')
  registerEvidence(@Body() input: ReleaseEvidenceBatchDto) {
    return {
      registered: input.evidence.map((item) =>
        this.evidence.register(item),
      ),
      summary: this.evidence.summary(),
    };
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}