import { Module } from "@nestjs/common";
import { VehicleEnterpriseIntelligenceModule } from "../enterprise-intelligence/vehicle-enterprise-intelligence.module";
import { VehicleUltraIntelligenceModule } from "../ultra-intelligence/vehicle-ultra-intelligence.module";
import { VehicleAutonomousIntelligenceModule } from "../autonomous-intelligence/vehicle-autonomous-intelligence.module";
import { VehicleEvolutionIntelligenceModule } from "../evolution-intelligence/vehicle-evolution-intelligence.module";
import { VehicleIntelligencePlatformHealthService } from "./vehicle-intelligence-platform-health.service";
import { VehicleIntelligencePlatformRegistryService } from "./vehicle-intelligence-platform-registry.service";

@Module({
  imports: [
    VehicleEnterpriseIntelligenceModule,
    VehicleUltraIntelligenceModule,
    VehicleAutonomousIntelligenceModule,
    VehicleEvolutionIntelligenceModule,
  ],
  providers: [
    VehicleIntelligencePlatformHealthService,
    VehicleIntelligencePlatformRegistryService,
  ],
  exports: [
    VehicleEnterpriseIntelligenceModule,
    VehicleUltraIntelligenceModule,
    VehicleAutonomousIntelligenceModule,
    VehicleEvolutionIntelligenceModule,
    VehicleIntelligencePlatformHealthService,
    VehicleIntelligencePlatformRegistryService,
  ],
})
export class VehicleIntelligencePlatformModule {}
