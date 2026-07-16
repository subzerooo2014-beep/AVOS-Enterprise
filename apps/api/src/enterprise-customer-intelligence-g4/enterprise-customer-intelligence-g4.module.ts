import { Module } from "@nestjs/common";
import { EnterpriseCustomerIntelligenceG4Controller } from "./enterprise-customer-intelligence-g4.controller";
import { EnterpriseCustomerIntelligenceG4Service } from "./enterprise-customer-intelligence-g4.service";

@Module({
  controllers: [EnterpriseCustomerIntelligenceG4Controller],
  providers: [EnterpriseCustomerIntelligenceG4Service],
  exports: [EnterpriseCustomerIntelligenceG4Service],
})
export class EnterpriseCustomerIntelligenceG4Module {}