import { Module } from "@nestjs/common";
import { EnterpriseUltimateF5Controller } from "./enterprise-ultimate-f5.controller";
import { EnterpriseUltimateF5Service } from "./enterprise-ultimate-f5.service";

@Module({
  controllers: [EnterpriseUltimateF5Controller],
  providers: [EnterpriseUltimateF5Service],
  exports: [EnterpriseUltimateF5Service],
})
export class EnterpriseUltimateF5Module {}