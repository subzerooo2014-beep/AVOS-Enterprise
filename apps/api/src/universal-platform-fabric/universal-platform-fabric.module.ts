import { Module } from "@nestjs/common";
import { UniversalPlatformFabricController } from "./universal-platform-fabric.controller";
import { UniversalPlatformFabricService } from "./universal-platform-fabric.service";
import { CapabilityRegistryService } from "./services/capability-registry.service";
import { CapabilityMarketplaceService } from "./services/capability-marketplace.service";
import { ServiceRegistryService } from "./services/service-registry.service";
import { ModuleRegistryService } from "./services/module-registry.service";
import { DependencyGraphService } from "./services/dependency-graph.service";
import { VersionCompatibilityService } from "./services/version-compatibility.service";
import { ApiCompatibilityService } from "./services/api-compatibility.service";
import { RuntimeCompatibilityService } from "./services/runtime-compatibility.service";
import { BlueprintDependencyResolverService } from "./services/blueprint-dependency-resolver.service";
import { MigrationAssistantService } from "./services/migration-assistant.service";
import { PlatformStandardsService } from "./services/platform-standards.service";
import { PackageVerificationService } from "./services/package-verification.service";
import { DependencyVerificationService } from "./services/dependency-verification.service";
import { PlatformHealthService } from "./services/platform-health.service";
import { PlatformUpgradeService } from "./services/platform-upgrade.service";
import { MetadataRegistryService } from "./services/metadata-registry.service";
import { EventSchemaRegistryService } from "./services/event-schema-registry.service";
import { PlatformAuditService } from "./services/platform-audit.service";
import { PlatformFabricDashboardService } from "./services/platform-fabric-dashboard.service";
import { UniversalIntegrationRuntime } from "./runtime/universal-integration.runtime";
import { CapabilityRegistryRuntime } from "./runtime/capability-registry.runtime";
import { ServiceRegistryRuntime } from "./runtime/service-registry.runtime";
import { ModuleRegistryRuntime } from "./runtime/module-registry.runtime";
import { DependencyGraphRuntime } from "./runtime/dependency-graph.runtime";
import { CompatibilityValidatorRuntime } from "./runtime/compatibility-validator.runtime";
import { MigrationAssistantRuntime } from "./runtime/migration-assistant.runtime";
import { UpgradeManagerRuntime } from "./runtime/upgrade-manager.runtime";

@Module({
  controllers:[UniversalPlatformFabricController],
  providers:[
    UniversalPlatformFabricService,
    CapabilityRegistryService,CapabilityMarketplaceService,ServiceRegistryService,ModuleRegistryService,
    DependencyGraphService,VersionCompatibilityService,ApiCompatibilityService,RuntimeCompatibilityService,
    BlueprintDependencyResolverService,MigrationAssistantService,PlatformStandardsService,PackageVerificationService,
    DependencyVerificationService,PlatformHealthService,PlatformUpgradeService,MetadataRegistryService,
    EventSchemaRegistryService,PlatformAuditService,PlatformFabricDashboardService,
    UniversalIntegrationRuntime,CapabilityRegistryRuntime,ServiceRegistryRuntime,ModuleRegistryRuntime,
    DependencyGraphRuntime,CompatibilityValidatorRuntime,MigrationAssistantRuntime,UpgradeManagerRuntime
  ],
  exports:[UniversalPlatformFabricService],
})
export class UniversalPlatformFabricModule {}
