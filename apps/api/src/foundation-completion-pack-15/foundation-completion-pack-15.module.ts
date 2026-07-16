import { Module } from "@nestjs/common";
import { FoundationCompletionPack15Controller } from "./foundation-completion-pack-15.controller";
import { FoundationCompletionPack15Service } from "./foundation-completion-pack-15.service";
import { DigitalDnaRegistryService } from "./dna/digital-dna-registry.service";
import { DigitalDnaHistoryService } from "./history/digital-dna-history.service";
import { DigitalDnaEvolutionService } from "./evolution/digital-dna-evolution.service";
import { DigitalDnaValidatorService } from "./validation/digital-dna-validator.service";
import { DigitalDnaHealthService } from "./health/digital-dna-health.service";
import { DigitalDnaAuditService } from "./observability/digital-dna-audit.service";

@Module({
  controllers: [FoundationCompletionPack15Controller],
  providers: [
    FoundationCompletionPack15Service,
    DigitalDnaRegistryService,
    DigitalDnaHistoryService,
    DigitalDnaEvolutionService,
    DigitalDnaValidatorService,
    DigitalDnaHealthService,
    DigitalDnaAuditService
  ],
  exports: [
    FoundationCompletionPack15Service,
    DigitalDnaRegistryService,
    DigitalDnaHistoryService,
    DigitalDnaEvolutionService,
    DigitalDnaValidatorService,
    DigitalDnaHealthService,
    DigitalDnaAuditService
  ]
})
export class FoundationCompletionPack15Module {}
