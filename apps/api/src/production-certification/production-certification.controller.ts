import { Body, Controller, Get, Post } from '@nestjs/common';
import { CertificationControlDto } from './dto/certification-control.dto';
import { LoadTestResultDto } from './dto/load-test-result.dto';
import { ReleaseCandidateDto } from './dto/release-candidate.dto';
import { SecurityCertificationEngineService } from './security-certification-engine.service';
import { PerformanceCertificationEngineService } from './performance-certification-engine.service';
import { ReleaseCandidateEngineService } from './release-candidate-engine.service';
import { ProductionCertificationDashboardService } from './production-certification-dashboard.service';
import { PRODUCTION_CERTIFICATION_CAPABILITIES } from './production-certification.types';

@Controller('production-certification')
export class ProductionCertificationController {
  constructor(
    private readonly security: SecurityCertificationEngineService,
    private readonly performance: PerformanceCertificationEngineService,
    private readonly releases: ReleaseCandidateEngineService,
    private readonly dashboard: ProductionCertificationDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Production Certification Mega Bundle',
      count: PRODUCTION_CERTIFICATION_CAPABILITIES.length,
      capabilities: PRODUCTION_CERTIFICATION_CAPABILITIES,
    };
  }

  @Post('security/certify')
  certifySecurity(
    @Body() input: { controls: CertificationControlDto[] },
  ) {
    return this.security.certify(input.controls);
  }

  @Post('performance/certify')
  certifyPerformance(
    @Body() input: { results: LoadTestResultDto[] },
  ) {
    return this.performance.certify(input.results);
  }

  @Post('release-candidate/evaluate')
  evaluateReleaseCandidate(
    @Body() input: ReleaseCandidateDto,
  ) {
    const { status: _status, ...candidate } = input;
    return this.releases.evaluate(candidate);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}