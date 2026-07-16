import { Module } from "@nestjs/common";
import { FoundationCompletionPack18Controller } from "./foundation-completion-pack-18.controller";
import { FoundationCompletionPack18Service } from "./foundation-completion-pack-18.service";
import { FoundationComponentRegistryService } from "./registry/foundation-component-registry.service";
import { FoundationSelfValidationService } from "./validation/foundation-self-validation.service";
import { FoundationConsistencyService } from "./consistency/foundation-consistency.service";
import { FoundationMaturityService } from "./maturity/foundation-maturity.service";
import { FoundationReadinessService } from "./readiness/foundation-readiness.service";
import { FoundationRecommendationService } from "./recommendations/foundation-recommendation.service";
import { FoundationHealthService } from "./health/foundation-health.service";
import { FoundationValidationAuditService } from "./observability/foundation-validation-audit.service";

@Module({
  controllers: [FoundationCompletionPack18Controller],
  providers: [
    FoundationCompletionPack18Service,
    FoundationComponentRegistryService,
    FoundationSelfValidationService,
    FoundationConsistencyService,
    FoundationMaturityService,
    FoundationReadinessService,
    FoundationRecommendationService,
    FoundationHealthService,
    FoundationValidationAuditService
  ],
  exports: [
    FoundationCompletionPack18Service,
    FoundationComponentRegistryService,
    FoundationSelfValidationService,
    FoundationConsistencyService,
    FoundationMaturityService,
    FoundationReadinessService,
    FoundationRecommendationService,
    FoundationHealthService,
    FoundationValidationAuditService
  ]
})
export class FoundationCompletionPack18Module {}
