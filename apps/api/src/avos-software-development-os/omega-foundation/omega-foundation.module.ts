import { Module } from '@nestjs/common';
import { ArchitectureIntelligenceService } from './architecture-intelligence.service';
import { DigitalOrganizationOsService } from './digital-organization-os.service';
import { EvolutionIntelligenceService } from './evolution-intelligence.service';
import { HumanFinalAuthorityService } from './human-final-authority.service';
import { LivingBlueprintService } from './living-blueprint.service';
import { OmegaFoundationController } from './omega-foundation.controller';
import { OmegaFoundationService } from './omega-foundation.service';
import { SoftwareGenerationOrchestratorService } from './software-generation-orchestrator.service';
import { VerificationCertificationService } from './verification-certification.service';

@Module({
  controllers: [OmegaFoundationController],
  providers: [
    OmegaFoundationService,
    LivingBlueprintService,
    DigitalOrganizationOsService,
    ArchitectureIntelligenceService,
    SoftwareGenerationOrchestratorService,
    HumanFinalAuthorityService,
    VerificationCertificationService,
    EvolutionIntelligenceService,
  ],
  exports: [
    OmegaFoundationService,
    LivingBlueprintService,
    DigitalOrganizationOsService,
    ArchitectureIntelligenceService,
    SoftwareGenerationOrchestratorService,
    HumanFinalAuthorityService,
    VerificationCertificationService,
    EvolutionIntelligenceService,
  ],
})
export class OmegaFoundationModule {}