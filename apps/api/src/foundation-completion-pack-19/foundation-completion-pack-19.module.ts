import { Module } from "@nestjs/common";
import { FoundationCompletionPack19Controller } from "./foundation-completion-pack-19.controller";
import { FoundationCompletionPack19Service } from "./foundation-completion-pack-19.service";
import { EnterpriseOntologyRegistryService } from "./ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "./terms/ontology-term-registry.service";
import { OntologyRelationRegistryService } from "./relations/ontology-relation-registry.service";
import { OntologyConstraintRegistryService } from "./constraints/ontology-constraint-registry.service";
import { OntologyMappingService } from "./mapping/ontology-mapping.service";
import { OntologyValidatorService } from "./validation/ontology-validator.service";
import { OntologyVersionService } from "./versions/ontology-version.service";
import { OntologyHealthService } from "./health/ontology-health.service";
import { OntologyAuditService } from "./observability/ontology-audit.service";

@Module({
  controllers: [FoundationCompletionPack19Controller],
  providers: [
    FoundationCompletionPack19Service,
    EnterpriseOntologyRegistryService,
    OntologyTermRegistryService,
    OntologyRelationRegistryService,
    OntologyConstraintRegistryService,
    OntologyMappingService,
    OntologyValidatorService,
    OntologyVersionService,
    OntologyHealthService,
    OntologyAuditService
  ],
  exports: [
    FoundationCompletionPack19Service,
    EnterpriseOntologyRegistryService,
    OntologyTermRegistryService,
    OntologyRelationRegistryService,
    OntologyConstraintRegistryService,
    OntologyMappingService,
    OntologyValidatorService,
    OntologyVersionService,
    OntologyHealthService,
    OntologyAuditService
  ]
})
export class FoundationCompletionPack19Module {}
