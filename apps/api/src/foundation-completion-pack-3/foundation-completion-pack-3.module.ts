import { Module } from "@nestjs/common";
import { FoundationCompletionPack3Controller } from "./foundation-completion-pack-3.controller";
import { FoundationCompletionPack3Service } from "./foundation-completion-pack-3.service";
import { EnterpriseLanguageCoreService } from "./language/enterprise-language-core.service";
import { MetadataSchemaRegistryService } from "./metadata/metadata-schema-registry.service";
import { EnterpriseContractLayerService } from "./contracts/enterprise-contract-layer.service";
import { ContractCompatibilityValidatorService } from "./validation/contract-compatibility-validator.service";

@Module({
  controllers: [FoundationCompletionPack3Controller],
  providers: [
    FoundationCompletionPack3Service,
    EnterpriseLanguageCoreService,
    MetadataSchemaRegistryService,
    EnterpriseContractLayerService,
    ContractCompatibilityValidatorService
  ],
  exports: [
    FoundationCompletionPack3Service,
    EnterpriseLanguageCoreService,
    MetadataSchemaRegistryService,
    EnterpriseContractLayerService,
    ContractCompatibilityValidatorService
  ]
})
export class FoundationCompletionPack3Module {}
