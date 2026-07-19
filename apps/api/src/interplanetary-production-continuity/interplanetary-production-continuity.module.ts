import { Module } from "@nestjs/common";
import { AutonomousInfrastructureExpansionService } from "./autonomous-infrastructure-expansion.service";
import { AutonomousRecoveryBeyondPlanetaryScaleService } from "./autonomous-recovery-beyond-planetary-scale.service";
import { CivilizationMemoryVaultService } from "./civilization-memory-vault.service";
import { CivilizationalContinuityEngineService } from "./civilizational-continuity-engine.service";
import { ExtremeResilienceSurvivalPlanningService } from "./extreme-resilience-survival-planning.service";
import { InterplanetaryProductionContinuityController } from "./interplanetary-production-continuity.controller";
import { InterplanetaryProductionContinuityFinalCertificationService } from "./interplanetary-production-continuity-final-certification.service";
import { InterplanetaryProductionContinuityRuntimeService } from "./interplanetary-production-continuity-runtime.service";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";
import { LongTermKnowledgePreservationService } from "./long-term-knowledge-preservation.service";
import { MultiPlanetFederationArchitectureService } from "./multi-planet-federation-architecture.service";
import { PlanetaryInterplanetaryDigitalTwinService } from "./planetary-interplanetary-digital-twin.service";
import { SelfEvolvingGovernanceService } from "./self-evolving-governance.service";

@Module({
  controllers: [InterplanetaryProductionContinuityController],
  providers: [
    InterplanetaryProductionContinuityStore,
    MultiPlanetFederationArchitectureService,
    CivilizationalContinuityEngineService,
    AutonomousRecoveryBeyondPlanetaryScaleService,
    LongTermKnowledgePreservationService,
    CivilizationMemoryVaultService,
    AutonomousInfrastructureExpansionService,
    SelfEvolvingGovernanceService,
    PlanetaryInterplanetaryDigitalTwinService,
    ExtremeResilienceSurvivalPlanningService,
    InterplanetaryProductionContinuityRuntimeService,
    InterplanetaryProductionContinuityFinalCertificationService,
  ],
  exports: [
    InterplanetaryProductionContinuityRuntimeService,
    InterplanetaryProductionContinuityFinalCertificationService,
  ],
})
export class InterplanetaryProductionContinuityModule {}