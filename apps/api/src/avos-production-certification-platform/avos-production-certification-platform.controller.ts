import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApproveCertificationDto } from './dto/approve-certification.dto';
import { CollectEvidenceDto } from './dto/collect-evidence.dto';
import { RegisterPlatformDto } from './dto/register-platform.dto';
import { AuditTrailService } from './application/audit-trail.service';
import { CertificationEngineService } from './application/certification-engine.service';
import { ContinuousMonitoringService } from './application/continuous-monitoring.service';
import { DeploymentGateService } from './application/deployment-gate.service';
import { EvidenceCollectionService } from './application/evidence-collection.service';
import { PlatformRegistryService } from './application/platform-registry.service';
import { ProductionIntelligenceService } from './application/production-intelligence.service';
import { PlatformStatusService } from './platform-status.service';

@Controller('avos/production-certification')
export class AvosProductionCertificationPlatformController {
  constructor(
    private readonly statusService: PlatformStatusService,
    private readonly registry: PlatformRegistryService,
    private readonly evidence: EvidenceCollectionService,
    private readonly certification: CertificationEngineService,
    private readonly deploymentGate: DeploymentGateService,
    private readonly monitoring: ContinuousMonitoringService,
    private readonly intelligence: ProductionIntelligenceService,
    private readonly audit: AuditTrailService,
  ) {}

  @Get('status')
  status() {
    return this.statusService.status();
  }

  @Post('platforms/register')
  async register(@Body() dto: RegisterPlatformDto) {
    const result = await this.registry.register(dto);
    this.audit.record('platform.registered', 'system:api', dto.platformId, { ...result });
    return result;
  }

  @Get('platforms')
  platforms() {
    return this.registry.list();
  }

  @Post('evidence/collect')
  async collect(@Body() dto: CollectEvidenceDto) {
    const result = await this.evidence.collect(dto.platformId, dto.domains);
    this.audit.record('evidence.collected', 'system:collector', dto.platformId, {
      count: result.length,
    });
    return result;
  }

  @Get('evidence/:platformId')
  evidenceFor(@Param('platformId') platformId: string) {
    return this.evidence.get(platformId);
  }

  @Post('certification/evaluate/:platformId/:version')
  async evaluate(
    @Param('platformId') platformId: string,
    @Param('version') version: string,
  ) {
    const result = await this.certification.evaluate(platformId, version);
    this.audit.record('certification.evaluated', 'system:certification', platformId, {
      score: result.score,
      state: result.state,
    });
    return result;
  }

  @Post('certification/approve')
  async approve(@Body() dto: ApproveCertificationDto) {
    const result = await this.certification.approve(dto.platformId, dto.approvedBy);
    this.audit.record('certification.approved', dto.approvedBy, dto.platformId, {
      certificationId: result.id,
    });
    return result;
  }

  @Get('certification/:platformId')
  latest(@Param('platformId') platformId: string) {
    return this.certification.latest(platformId);
  }

  @Get('deployment-gate/:platformId')
  deployment(@Param('platformId') platformId: string) {
    return this.deploymentGate.evaluate(platformId);
  }

  @Get('monitor/:platformId')
  monitoringStatus(@Param('platformId') platformId: string) {
    return this.monitoring.inspect(platformId);
  }

  @Post('intelligence/recommend')
  recommend(@Body() body: { reasons?: string[] }) {
    return this.intelligence.recommend(body.reasons ?? []);
  }

  @Get('audit')
  auditEntries(@Query('platformId') platformId?: string) {
    return this.audit.list(platformId);
  }
}

