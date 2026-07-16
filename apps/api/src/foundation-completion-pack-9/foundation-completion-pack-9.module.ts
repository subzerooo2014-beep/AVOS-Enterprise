import { Module } from "@nestjs/common";
import { FoundationCompletionPack9Controller } from "./foundation-completion-pack-9.controller";
import { FoundationCompletionPack9Service } from "./foundation-completion-pack-9.service";
import { DigitalIdentityRegistryService } from "./identity/digital-identity-registry.service";
import { EnterpriseMetadataRegistryService } from "./metadata/enterprise-metadata-registry.service";
import { CapabilityContractRegistryService } from "./contracts/capability-contract-registry.service";
import { EnterpriseDependencyGraphService } from "./dependencies/enterprise-dependency-graph.service";
import { DependencyImpactAnalysisService } from "./lineage/dependency-impact-analysis.service";
import { ArchitectureFoundationValidatorService } from "./validation/architecture-foundation-validator.service";
import { Foundation9AuditService } from "./observability/foundation-9-audit.service";

@Module({
  controllers: [FoundationCompletionPack9Controller],
  providers: [
    FoundationCompletionPack9Service,
    DigitalIdentityRegistryService,
    EnterpriseMetadataRegistryService,
    CapabilityContractRegistryService,
    EnterpriseDependencyGraphService,
    DependencyImpactAnalysisService,
    ArchitectureFoundationValidatorService,
    Foundation9AuditService
  ],
  exports: [
    FoundationCompletionPack9Service,
    DigitalIdentityRegistryService,
    EnterpriseMetadataRegistryService,
    CapabilityContractRegistryService,
    EnterpriseDependencyGraphService,
    DependencyImpactAnalysisService,
    ArchitectureFoundationValidatorService,
    Foundation9AuditService
  ]
})
export class FoundationCompletionPack9Module {}
