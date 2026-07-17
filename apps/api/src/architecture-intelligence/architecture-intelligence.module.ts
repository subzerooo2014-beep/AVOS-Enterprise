import { Module } from "@nestjs/common";
import { ArchitectureIntelligenceController } from "./architecture-intelligence.controller";
import { ArchitectureAnalysisService } from "./services/architecture-analysis.service";
import { ArchitectureCertificationService } from "./services/architecture-certification.service";
import { ArchitectureGovernanceService } from "./services/architecture-governance.service";
import { ArchitectureHealthService } from "./services/architecture-health.service";
import { ArchitectureRegistryService } from "./services/architecture-registry.service";
import { ArchitectureRulesService } from "./services/architecture-rules.service";
import { ChangeImpactService } from "./services/change-impact.service";

@Module({
  controllers: [ArchitectureIntelligenceController],
  providers: [
    ArchitectureRegistryService,
    ArchitectureRulesService,
    ArchitectureAnalysisService,
    ArchitectureGovernanceService,
    ArchitectureHealthService,
    ChangeImpactService,
    ArchitectureCertificationService,
  ],
  exports: [
    ArchitectureRegistryService,
    ArchitectureRulesService,
    ArchitectureAnalysisService,
    ArchitectureGovernanceService,
    ArchitectureHealthService,
    ChangeImpactService,
    ArchitectureCertificationService,
  ],
})
export class ArchitectureIntelligenceModule {}