import { Module } from "@nestjs/common";
import { FoundationCompletionPack17Controller } from "./foundation-completion-pack-17.controller";
import { FoundationCompletionPack17Service } from "./foundation-completion-pack-17.service";
import { FoundationCapabilityRegistryService } from "./registry/foundation-capability-registry.service";
import { FoundationApiContractRegistryService } from "./contracts/foundation-api-contract-registry.service";
import { FoundationCapabilityDiscoveryService } from "./discovery/foundation-capability-discovery.service";
import { UnifiedFoundationGatewayService } from "./gateway/unified-foundation-gateway.service";
import { FoundationSdkDiagnosticsService } from "./diagnostics/foundation-sdk-diagnostics.service";
import { FoundationSdkHealthService } from "./health/foundation-sdk-health.service";
import { FoundationSdkAuditService } from "./observability/foundation-sdk-audit.service";

@Module({
  controllers: [FoundationCompletionPack17Controller],
  providers: [
    FoundationCompletionPack17Service,
    FoundationCapabilityRegistryService,
    FoundationApiContractRegistryService,
    FoundationCapabilityDiscoveryService,
    UnifiedFoundationGatewayService,
    FoundationSdkDiagnosticsService,
    FoundationSdkHealthService,
    FoundationSdkAuditService
  ],
  exports: [
    FoundationCompletionPack17Service,
    FoundationCapabilityRegistryService,
    FoundationApiContractRegistryService,
    FoundationCapabilityDiscoveryService,
    UnifiedFoundationGatewayService,
    FoundationSdkDiagnosticsService,
    FoundationSdkHealthService,
    FoundationSdkAuditService
  ]
})
export class FoundationCompletionPack17Module {}
