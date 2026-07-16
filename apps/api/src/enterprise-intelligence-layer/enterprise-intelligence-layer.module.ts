import { Module } from "@nestjs/common";
import { EnterpriseIntelligenceLayerController } from "./enterprise-intelligence-layer.controller";
import { EnterpriseIntelligenceLayerService } from "./enterprise-intelligence-layer.service";

@Module({
  controllers: [EnterpriseIntelligenceLayerController],
  providers: [EnterpriseIntelligenceLayerService],
  exports: [EnterpriseIntelligenceLayerService],
})
export class EnterpriseIntelligenceLayerModule {}