import { Module } from "@nestjs/common";
import { DependencyRegistryModule } from "./registry";
import { DependencyScannerModule } from "./scanner";
import { DependencyGraphModule } from "./graph";
import { DependencyResolverModule } from "./resolver";
import { DependencyImpactModule } from "./impact";
import { DependencyRiskModule } from "./risk";
import { DependencyAnalyticsModule } from "./analytics";
import { DependencyAutomationModule } from "./automation";
import { DependencyCertificationModule } from "./certification";

@Module({
  imports: [
    DependencyRegistryModule,
    DependencyScannerModule,
    DependencyGraphModule,
    DependencyResolverModule,
    DependencyImpactModule,
    DependencyRiskModule,
    DependencyAnalyticsModule,
    DependencyAutomationModule,
    DependencyCertificationModule
  ],
  exports: [
    DependencyRegistryModule,
    DependencyScannerModule,
    DependencyGraphModule,
    DependencyResolverModule,
    DependencyImpactModule,
    DependencyRiskModule,
    DependencyAnalyticsModule,
    DependencyAutomationModule,
    DependencyCertificationModule
  ],
})
export class EnterpriseDependencyGraphModule {}