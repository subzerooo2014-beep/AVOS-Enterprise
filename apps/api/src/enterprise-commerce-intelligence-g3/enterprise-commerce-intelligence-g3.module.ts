import { Module } from "@nestjs/common";
import { EnterpriseCommerceIntelligenceG3Controller } from "./enterprise-commerce-intelligence-g3.controller";
import { EnterpriseCommerceIntelligenceG3Service } from "./enterprise-commerce-intelligence-g3.service";

@Module({
  controllers: [EnterpriseCommerceIntelligenceG3Controller],
  providers: [EnterpriseCommerceIntelligenceG3Service],
  exports: [EnterpriseCommerceIntelligenceG3Service],
})
export class EnterpriseCommerceIntelligenceG3Module {}