import { Module } from "@nestjs/common";
import { FoundationCompletionPack10Controller } from "./foundation-completion-pack-10.controller";
import { FoundationCompletionPack10Service } from "./foundation-completion-pack-10.service";
import { LivingBlueprintRegistryService } from "./blueprints/living-blueprint-registry.service";
import { BlueprintVersionManagerService } from "./versions/blueprint-version-manager.service";
import { BlueprintDiffEngineService } from "./diff/blueprint-diff-engine.service";
import { RuntimeArchitectureSnapshotService } from "./runtime/runtime-architecture-snapshot.service";
import { ArchitectureDriftDetectorService } from "./drift/architecture-drift-detector.service";
import { ArchitectureRuleEngineService } from "./rules/architecture-rule-engine.service";
import { ArchitectureCompatibilityValidatorService } from "./compatibility/architecture-compatibility-validator.service";
import { DependencyHealthAnalyzerService } from "./health/dependency-health-analyzer.service";
import { ArchitectureChangeImpactService } from "./impact/architecture-change-impact.service";
import { ArchitectureRecommendationEngineService } from "./recommendations/architecture-recommendation-engine.service";
import { FoundationHealthIndexService } from "./health/foundation-health-index.service";
import { ArchitectureAuditService } from "./observability/architecture-audit.service";

@Module({
  controllers: [FoundationCompletionPack10Controller],
  providers: [
    FoundationCompletionPack10Service,
    LivingBlueprintRegistryService,
    BlueprintVersionManagerService,
    BlueprintDiffEngineService,
    RuntimeArchitectureSnapshotService,
    ArchitectureDriftDetectorService,
    ArchitectureRuleEngineService,
    ArchitectureCompatibilityValidatorService,
    DependencyHealthAnalyzerService,
    ArchitectureChangeImpactService,
    ArchitectureRecommendationEngineService,
    FoundationHealthIndexService,
    ArchitectureAuditService
  ],
  exports: [
    FoundationCompletionPack10Service,
    LivingBlueprintRegistryService,
    BlueprintVersionManagerService,
    BlueprintDiffEngineService,
    RuntimeArchitectureSnapshotService,
    ArchitectureDriftDetectorService,
    ArchitectureRuleEngineService,
    ArchitectureCompatibilityValidatorService,
    DependencyHealthAnalyzerService,
    ArchitectureChangeImpactService,
    ArchitectureRecommendationEngineService,
    FoundationHealthIndexService,
    ArchitectureAuditService
  ]
})
export class FoundationCompletionPack10Module {}
