import { Module } from "@nestjs/common";
import { EnterpriseFinanceIntelligenceG5Controller } from "./enterprise-finance-intelligence-g5.controller";
import { EnterpriseFinanceIntelligenceG5Service } from "./enterprise-finance-intelligence-g5.service";

@Module({
  controllers: [EnterpriseFinanceIntelligenceG5Controller],
  providers: [EnterpriseFinanceIntelligenceG5Service],
  exports: [EnterpriseFinanceIntelligenceG5Service],
})
export class EnterpriseFinanceIntelligenceG5Module {}