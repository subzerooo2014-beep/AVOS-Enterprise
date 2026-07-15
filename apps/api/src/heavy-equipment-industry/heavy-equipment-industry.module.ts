import { Module } from "@nestjs/common";
import { HeavyEquipmentAssetsService } from "./heavy-equipment-assets.service";
import { HeavyEquipmentIndustryController } from "./heavy-equipment-industry.controller";
import { HeavyEquipmentIntelligenceService } from "./heavy-equipment-intelligence.service";
import { HeavyEquipmentOperationsService } from "./heavy-equipment-operations.service";

@Module({
  controllers: [HeavyEquipmentIndustryController],
  providers: [
    HeavyEquipmentAssetsService,
    HeavyEquipmentOperationsService,
    HeavyEquipmentIntelligenceService,
  ],
  exports: [
    HeavyEquipmentAssetsService,
    HeavyEquipmentOperationsService,
    HeavyEquipmentIntelligenceService,
  ],
})
export class HeavyEquipmentIndustryModule {}