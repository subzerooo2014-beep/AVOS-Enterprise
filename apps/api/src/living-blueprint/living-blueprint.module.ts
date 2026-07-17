import { Module } from "@nestjs/common";
import { LivingBlueprintController } from "./living-blueprint.controller";
import { BlueprintEvolutionService } from "./services/blueprint-evolution.service";
import { BlueprintSnapshotService } from "./services/blueprint-snapshot.service";
import { BlueprintValidationService } from "./services/blueprint-validation.service";
import { LivingBlueprintCertificationService } from "./services/living-blueprint-certification.service";
import { LivingBlueprintRegistryService } from "./services/living-blueprint-registry.service";
import { RuntimeTopologyService } from "./services/runtime-topology.service";

@Module({
  controllers: [LivingBlueprintController],
  providers: [
    LivingBlueprintRegistryService,
    BlueprintSnapshotService,
    RuntimeTopologyService,
    BlueprintValidationService,
    BlueprintEvolutionService,
    LivingBlueprintCertificationService,
  ],
  exports: [
    LivingBlueprintRegistryService,
    BlueprintSnapshotService,
    RuntimeTopologyService,
    BlueprintValidationService,
    BlueprintEvolutionService,
    LivingBlueprintCertificationService,
  ],
})
export class LivingBlueprintModule {}