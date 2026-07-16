import { Module } from "@nestjs/common";
import { FoundationCompletionPack16Controller } from "./foundation-completion-pack-16.controller";
import { FoundationCompletionPack16Service } from "./foundation-completion-pack-16.service";
import { EnterpriseDigitalGenomeRegistryService } from "./genome/enterprise-digital-genome-registry.service";
import { GenomeCompositionEngineService } from "./composition/genome-composition-engine.service";
import { GenomeSnapshotService } from "./snapshots/genome-snapshot.service";
import { GenomeComparisonService } from "./comparison/genome-comparison.service";
import { GenomeEvolutionService } from "./evolution/genome-evolution.service";
import { GenomeValidatorService } from "./validation/genome-validator.service";
import { GenomeHealthService } from "./health/genome-health.service";
import { GenomeAuditService } from "./observability/genome-audit.service";

@Module({
  controllers: [FoundationCompletionPack16Controller],
  providers: [
    FoundationCompletionPack16Service,
    EnterpriseDigitalGenomeRegistryService,
    GenomeCompositionEngineService,
    GenomeSnapshotService,
    GenomeComparisonService,
    GenomeEvolutionService,
    GenomeValidatorService,
    GenomeHealthService,
    GenomeAuditService
  ],
  exports: [
    FoundationCompletionPack16Service,
    EnterpriseDigitalGenomeRegistryService,
    GenomeCompositionEngineService,
    GenomeSnapshotService,
    GenomeComparisonService,
    GenomeEvolutionService,
    GenomeValidatorService,
    GenomeHealthService,
    GenomeAuditService
  ]
})
export class FoundationCompletionPack16Module {}
