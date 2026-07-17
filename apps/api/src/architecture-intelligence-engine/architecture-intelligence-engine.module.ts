import { Module } from "@nestjs/common";
import { ArchitectureRegistryModule } from "./registry";
import { ArchitectureObservatoryModule } from "./observatory";
import { ArchitectureQualityModule } from "./quality";
import { ArchitectureCompatibilityModule } from "./compatibility";
import { ArchitectureEvolutionModule } from "./evolution";
import { ArchitectureRiskModule } from "./risk";
import { ArchitectureRecommendationModule } from "./recommendation";
import { ArchitectureGovernanceModule } from "./governance";
import { ArchitectureCertificationModule } from "./certification";

@Module({
  imports: [
    ArchitectureRegistryModule,
    ArchitectureObservatoryModule,
    ArchitectureQualityModule,
    ArchitectureCompatibilityModule,
    ArchitectureEvolutionModule,
    ArchitectureRiskModule,
    ArchitectureRecommendationModule,
    ArchitectureGovernanceModule,
    ArchitectureCertificationModule
  ],
  exports: [
    ArchitectureRegistryModule,
    ArchitectureObservatoryModule,
    ArchitectureQualityModule,
    ArchitectureCompatibilityModule,
    ArchitectureEvolutionModule,
    ArchitectureRiskModule,
    ArchitectureRecommendationModule,
    ArchitectureGovernanceModule,
    ArchitectureCertificationModule
  ],
})
export class ArchitectureIntelligenceEngineModule {}