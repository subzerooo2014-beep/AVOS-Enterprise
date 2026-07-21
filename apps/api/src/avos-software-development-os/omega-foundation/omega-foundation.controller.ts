import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArchitectureIntelligenceService } from './architecture-intelligence.service';
import { DigitalOrganizationOsService } from './digital-organization-os.service';
import { EvolutionIntelligenceService } from './evolution-intelligence.service';
import { HumanFinalAuthorityService } from './human-final-authority.service';
import { LivingBlueprintService } from './living-blueprint.service';
import { OmegaFoundationService } from './omega-foundation.service';
import { SoftwareGenerationOrchestratorService } from './software-generation-orchestrator.service';
import { VerificationCertificationService } from './verification-certification.service';

@Controller('avos/software-development/omega')
export class OmegaFoundationController {
  constructor(
    private readonly omega: OmegaFoundationService,
    private readonly blueprint: LivingBlueprintService,
    private readonly organization: DigitalOrganizationOsService,
    private readonly architecture: ArchitectureIntelligenceService,
    private readonly generation: SoftwareGenerationOrchestratorService,
    private readonly authority: HumanFinalAuthorityService,
    private readonly verification: VerificationCertificationService,
    private readonly evolution: EvolutionIntelligenceService,
  ) {}

  @Post('boot')
  boot() {
    return this.omega.boot();
  }

  @Get('status')
  status() {
    return this.omega.status();
  }

  @Get('blueprint')
  getBlueprint() {
    return this.blueprint.get();
  }

  @Post('blueprint/synchronize')
  synchronizeBlueprint(@Body() body: { capabilities?: string[] }) {
    return this.blueprint.synchronize(body?.capabilities ?? []);
  }

  @Get('organization')
  getOrganization() {
    return this.organization.getOrganization();
  }

  @Post('architecture/review')
  reviewArchitecture(@Body() body: Record<string, unknown>) {
    return this.architecture.review(body ?? {});
  }

  @Post('generation/plan')
  createGenerationPlan(@Body() body: Record<string, unknown>) {
    return this.generation.createPlan(body ?? {});
  }

  @Post('authority/request')
  requestApproval(@Body() body: { type?: string; summary?: string }) {
    return this.authority.requestApproval(
      body?.type ?? 'strategic-change',
      body?.summary ?? 'Omega Foundation strategic change',
    );
  }

  @Post('authority/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.authority.approve(id, body.approvedBy);
  }

  @Get('authority/decisions')
  decisions() {
    return this.authority.list();
  }

  @Post('verification/run')
  verify() {
    return this.verification.verify();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy?: string }) {
    return this.verification.certify(body?.approvedBy ?? 'human:khalifa');
  }

  @Post('evolution/analyze')
  analyzeEvolution(@Body() body: Record<string, unknown>) {
    return this.evolution.analyze(body ?? {});
  }

  @Get('dashboard')
  dashboard() {
    return {
      status: this.omega.status(),
      blueprint: this.blueprint.get(),
      organization: this.organization.getOrganization(),
      verification: this.verification.verify(),
    };
  }
}