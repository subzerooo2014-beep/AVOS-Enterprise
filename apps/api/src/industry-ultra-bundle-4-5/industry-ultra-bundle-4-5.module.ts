import { Module } from "@nestjs/common";
import { AgricultureAgritechIndustryController } from "./agriculture-agritech.controller";
import { EnvironmentWasteIndustryController } from "./environment-waste.controller";
import { FoodBeverageIndustryController } from "./food-beverage.controller";
import { IndustryUltraBundle45Service } from "./industry-ultra-bundle-4-5.service";
import { LegalProfessionalServicesIndustryController } from "./legal-professional-services.controller";
import { MediaEntertainmentIndustryController } from "./media-entertainment.controller";
import { MiningResourcesIndustryController } from "./mining-resources.controller";
import { NonprofitHumanitarianIndustryController } from "./nonprofit-humanitarian.controller";
import { SecurityEmergencyServicesIndustryController } from "./security-emergency-services.controller";
import { SpaceSatelliteIndustryController } from "./space-satellite.controller";
import { SportsEventsIndustryController } from "./sports-events.controller";

@Module({
  controllers: [
    AgricultureAgritechIndustryController,
    FoodBeverageIndustryController,
    MiningResourcesIndustryController,
    MediaEntertainmentIndustryController,
    SportsEventsIndustryController,
    LegalProfessionalServicesIndustryController,
    SecurityEmergencyServicesIndustryController,
    EnvironmentWasteIndustryController,
    SpaceSatelliteIndustryController,
    NonprofitHumanitarianIndustryController,
  ],
  providers: [IndustryUltraBundle45Service],
  exports: [IndustryUltraBundle45Service],
})
export class IndustryUltraBundle45Module {}