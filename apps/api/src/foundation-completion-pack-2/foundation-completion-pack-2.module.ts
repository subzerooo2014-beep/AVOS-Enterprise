import { Module } from "@nestjs/common";
import { FoundationCompletionPack2Controller } from "./foundation-completion-pack-2.controller";
import { FoundationCompletionPack2Service } from "./foundation-completion-pack-2.service";
import { FoundationIdentityService } from "./identity/foundation-identity.service";
import { UnifiedCapabilityRegistryService } from "./capability/unified-capability-registry.service";
import { EnterpriseDependencyGraphService } from "./dependency/enterprise-dependency-graph.service";

@Module({
  controllers: [FoundationCompletionPack2Controller],
  providers: [
    FoundationCompletionPack2Service,
    FoundationIdentityService,
    UnifiedCapabilityRegistryService,
    EnterpriseDependencyGraphService
  ],
  exports: [
    FoundationCompletionPack2Service,
    FoundationIdentityService,
    UnifiedCapabilityRegistryService,
    EnterpriseDependencyGraphService
  ]
})
export class FoundationCompletionPack2Module {}
