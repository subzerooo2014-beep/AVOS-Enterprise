import { Module } from "@nestjs/common";
import { AutonomousProductionEconomyService } from "./autonomous-production-economy.service";
import { CrossRegionReplicationService } from "./cross-region-replication.service";
import { DisasterRecoveryGridService } from "./disaster-recovery-grid.service";
import { GeoAwareOrchestrationService } from "./geo-aware-orchestration.service";
import { GlobalDigitalTwinService } from "./global-digital-twin.service";
import { GlobalFactoryRegistryService } from "./global-factory-registry.service";
import { GlobalProductionIntelligenceService } from "./global-production-intelligence.service";
import { GlobalProductionMarketplaceService } from "./global-production-marketplace.service";
import { GlobalProductionOsController } from "./global-production-os.controller";
import { GlobalProductionOsFinalCertificationService } from "./global-production-os-final-certification.service";
import { GlobalProductionOsRuntimeService } from "./global-production-os-runtime.service";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { ProductionEvolutionEngineService } from "./production-evolution-engine.service";
import { SovereignComplianceRoutingService } from "./sovereign-compliance-routing.service";

@Module({
  controllers: [GlobalProductionOsController],
  providers: [
    GlobalProductionOsStore,
    GlobalFactoryRegistryService,
    SovereignComplianceRoutingService,
    GeoAwareOrchestrationService,
    CrossRegionReplicationService,
    DisasterRecoveryGridService,
    GlobalProductionIntelligenceService,
    GlobalProductionMarketplaceService,
    AutonomousProductionEconomyService,
    GlobalDigitalTwinService,
    ProductionEvolutionEngineService,
    GlobalProductionOsRuntimeService,
    GlobalProductionOsFinalCertificationService
  ],
  exports: [
    GlobalProductionOsStore,
    GlobalFactoryRegistryService,
    SovereignComplianceRoutingService,
    GeoAwareOrchestrationService,
    CrossRegionReplicationService,
    DisasterRecoveryGridService,
    GlobalProductionIntelligenceService,
    GlobalProductionMarketplaceService,
    AutonomousProductionEconomyService,
    GlobalDigitalTwinService,
    ProductionEvolutionEngineService,
    GlobalProductionOsRuntimeService,
    GlobalProductionOsFinalCertificationService
  ]
})
export class GlobalProductionOsModule {}