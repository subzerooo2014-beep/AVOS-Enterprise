import { Body, Controller, Get, Post } from "@nestjs/common";
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
import { PlatformFabricDashboardService } from "./services/platform-fabric-dashboard.service";

@Controller("universal-platform-fabric")
export class UniversalPlatformFabricController {
  constructor(
    private readonly os:UniversalPlatformFabricService,
    private readonly capabilities:CapabilityRegistryService,
    private readonly marketplace:CapabilityMarketplaceService,
    private readonly services:ServiceRegistryService,
    private readonly modules:ModuleRegistryService,
    private readonly dependencies:DependencyGraphService,
    private readonly versions:VersionCompatibilityService,
    private readonly apiCompatibility:ApiCompatibilityService,
    private readonly runtimeCompatibility:RuntimeCompatibilityService,
    private readonly blueprintResolver:BlueprintDependencyResolverService,
    private readonly migration:MigrationAssistantService,
    private readonly standards:PlatformStandardsService,
    private readonly packageVerification:PackageVerificationService,
    private readonly dependencyVerification:DependencyVerificationService,
    private readonly platformHealth:PlatformHealthService,
    private readonly upgrades:PlatformUpgradeService,
    private readonly metadata:MetadataRegistryService,
    private readonly eventSchemas:EventSchemaRegistryService,
    private readonly dashboard:PlatformFabricDashboardService,
  ){}

  @Get("health") health(){return this.os.health();}
  @Post("capabilities") capability(@Body() b:any){return {success:true,capability:this.capabilities.create(b)};}
  @Post("marketplace") marketplaceEntry(@Body() b:any){return {success:true,entry:this.marketplace.create(b)};}
  @Post("services") service(@Body() b:any){return {success:true,service:this.services.create(b)};}
  @Post("modules") module(@Body() b:any){return {success:true,module:this.modules.create(b)};}
  @Post("dependencies") dependency(@Body() b:any){return {success:true,dependency:this.dependencies.create(b)};}
  @Post("compatibility/version") versionCompatibility(@Body() b:any){return {success:true,result:this.versions.create(b)};}
  @Post("compatibility/api") apiCompatibilityCheck(@Body() b:any){return {success:true,result:this.apiCompatibility.create(b)};}
  @Post("compatibility/runtime") runtimeCompatibilityCheck(@Body() b:any){return {success:true,result:this.runtimeCompatibility.create(b)};}
  @Post("blueprints/resolve") resolveBlueprint(@Body() b:any){return {success:true,result:this.blueprintResolver.create(b)};}
  @Post("migrations") migrationPlan(@Body() b:any){return {success:true,plan:this.migration.create(b)};}
  @Post("standards") standard(@Body() b:any){return {success:true,standard:this.standards.create(b)};}
  @Post("packages/verify") verifyPackage(@Body() b:any){return {success:true,result:this.packageVerification.create(b)};}
  @Post("dependencies/verify") verifyDependencies(@Body() b:any){return {success:true,result:this.dependencyVerification.create(b)};}
  @Post("platform-health") healthCheck(@Body() b:any){return {success:true,result:this.platformHealth.create(b)};}
  @Post("upgrades") upgrade(@Body() b:any){return {success:true,upgrade:this.upgrades.create(b)};}
  @Post("metadata") metadataEntry(@Body() b:any){return {success:true,metadata:this.metadata.create(b)};}
  @Post("event-schemas") eventSchema(@Body() b:any){return {success:true,schema:this.eventSchemas.create(b)};}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
