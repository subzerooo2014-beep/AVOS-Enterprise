import { Module } from "@nestjs/common";
import { AviationIndustryController } from "./aviation.controller";
import { BankingFintechIndustryController } from "./banking-fintech.controller";
import { EducationIndustryController } from "./education.controller";
import { EnergyUtilitiesIndustryController } from "./energy-utilities.controller";
import { GovernmentPublicSectorIndustryController } from "./government-public-sector.controller";
import { HospitalityTourismIndustryController } from "./hospitality-tourism.controller";
import { IndustryUltraBundle23Service } from "./industry-ultra-bundle-2-3.service";
import { InsuranceIndustryController } from "./insurance.controller";
import { MaritimeIndustryController } from "./maritime.controller";
import { RetailCommerceIndustryController } from "./retail-commerce.controller";
import { TelecommunicationsIndustryController } from "./telecommunications.controller";

@Module({
  controllers: [
    EnergyUtilitiesIndustryController,
    RetailCommerceIndustryController,
    HospitalityTourismIndustryController,
    EducationIndustryController,
    GovernmentPublicSectorIndustryController,
    BankingFintechIndustryController,
    InsuranceIndustryController,
    TelecommunicationsIndustryController,
    AviationIndustryController,
    MaritimeIndustryController,
  ],
  providers: [IndustryUltraBundle23Service],
  exports: [IndustryUltraBundle23Service],
})
export class IndustryUltraBundle23Module {}