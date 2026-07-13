import { Module } from "@nestjs/common";
import { VehicleEnterpriseIntelligenceModule } from "../enterprise-intelligence/vehicle-enterprise-intelligence.module";
import { VehicleUltraIntelligenceModule } from "../ultra-intelligence/vehicle-ultra-intelligence.module";
import { VehicleAutonomousIntelligenceModule } from "../autonomous-intelligence/vehicle-autonomous-intelligence.module";
import { VehicleEvolutionIntelligenceModule } from "../evolution-intelligence/vehicle-evolution-intelligence.module";
import { VehicleStrategicIntelligenceModule } from "../strategic-intelligence/vehicle-strategic-intelligence.module";
import { VehicleIntelligencePlatformModule } from "../platform-integration/vehicle-intelligence-platform.module";
import { VehicleIntelligenceCommandCenterService } from "./vehicle-intelligence-command-center.service";
import { VehicleIntelligenceControlPlaneService } from "./vehicle-intelligence-control-plane.service";
import { VehicleIntelligenceReleaseGateService } from "./vehicle-intelligence-release-gate.service";
import { VehicleIntelligenceObservabilityService } from "./vehicle-intelligence-observability.service";
import { VehicleIntelligenceSelfHealingService } from "./vehicle-intelligence-self-healing.service";
import { VehicleIntelligenceEvidenceLedgerService } from "./vehicle-intelligence-evidence-ledger.service";
import { VehicleIntelligenceCapabilityCatalogService } from "./vehicle-intelligence-capability-catalog.service";
import { VehicleIntelligenceFinalOrchestratorService } from "./vehicle-intelligence-final-orchestrator.service";

@Module({
  imports: [
    VehicleEnterpriseIntelligenceModule,
    VehicleUltraIntelligenceModule,
    VehicleAutonomousIntelligenceModule,
    VehicleEvolutionIntelligenceModule,
    VehicleStrategicIntelligenceModule,
    VehicleIntelligencePlatformModule,
  ],
  providers: [
    VehicleIntelligenceCommandCenterService,
    VehicleIntelligenceControlPlaneService,
    VehicleIntelligenceReleaseGateService,
    VehicleIntelligenceObservabilityService,
    VehicleIntelligenceSelfHealingService,
    VehicleIntelligenceEvidenceLedgerService,
    VehicleIntelligenceCapabilityCatalogService,
    VehicleIntelligenceFinalOrchestratorService,
  ],
  exports: [
    VehicleIntelligenceFinalOrchestratorService,
    VehicleIntelligenceCapabilityCatalogService,
  ],
})
export class VehicleIntelligenceFinalModule {}
