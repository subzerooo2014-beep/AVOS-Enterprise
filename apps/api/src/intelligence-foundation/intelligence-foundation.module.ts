import { Module } from "@nestjs/common";
import { DigitalDnaService } from "./digital-dna.service";
import { EnterpriseBrainFoundationService } from "./enterprise-brain-foundation.service";
import { IntelligenceFoundationController } from "./intelligence-foundation.controller";
import { IntelligenceFoundationService } from "./intelligence-foundation.service";
import { KnowledgeFabricService } from "./knowledge-fabric.service";
import { LivingBlueprintService } from "./living-blueprint.service";

@Module({
  controllers: [IntelligenceFoundationController],
  providers: [
    KnowledgeFabricService,
    LivingBlueprintService,
    DigitalDnaService,
    EnterpriseBrainFoundationService,
    IntelligenceFoundationService,
  ],
  exports: [
    KnowledgeFabricService,
    LivingBlueprintService,
    DigitalDnaService,
    EnterpriseBrainFoundationService,
    IntelligenceFoundationService,
  ],
})
export class IntelligenceFoundationModule {}
