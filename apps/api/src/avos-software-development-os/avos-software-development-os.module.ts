import { SoftwareDevelopmentOsUltimateModule } from './ultimate-mega-pack/software-development-os-ultimate.module';
import { SoftwareDevelopmentOsProductionModule } from './production-integration/software-development-os-production.module';
import { Module } from '@nestjs/common';
import { ArchitectureIntelligenceService } from './architecture-intelligence.service';
import { AvosSoftwareDevelopmentOsController } from './avos-software-development-os.controller';
import { AvosSoftwareDevelopmentOsService } from './avos-software-development-os.service';
import { DigitalOrganizationService } from './digital-organization.service';
import { EvolutionIntelligenceService } from './evolution-intelligence.service';
import { HumanFinalAuthorityService } from './human-final-authority.service';
import { LivingBlueprintService } from './living-blueprint.service';
import { SoftwareGenerationOrchestratorService } from './software-generation-orchestrator.service';
import { VerificationCertificationService } from './verification-certification.service';

@Module({
  imports: [
    SoftwareDevelopmentOsUltimateModule,SoftwareDevelopmentOsProductionModule],
  controllers: [AvosSoftwareDevelopmentOsController],
  providers: [
    AvosSoftwareDevelopmentOsService,
    ArchitectureIntelligenceService,
    DigitalOrganizationService,
    EvolutionIntelligenceService,
    HumanFinalAuthorityService,
    LivingBlueprintService,
    SoftwareGenerationOrchestratorService,
    VerificationCertificationService,
  ],
  exports: [AvosSoftwareDevelopmentOsService],
})
export class AvosSoftwareDevelopmentOsModule {}

