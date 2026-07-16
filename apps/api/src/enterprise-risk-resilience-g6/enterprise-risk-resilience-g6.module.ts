import { Module } from "@nestjs/common";
import { EnterpriseRiskResilienceG6Controller } from "./enterprise-risk-resilience-g6.controller";
import { EnterpriseRiskResilienceG6Service } from "./enterprise-risk-resilience-g6.service";

@Module({
  controllers: [EnterpriseRiskResilienceG6Controller],
  providers: [EnterpriseRiskResilienceG6Service],
  exports: [EnterpriseRiskResilienceG6Service],
})
export class EnterpriseRiskResilienceG6Module {}