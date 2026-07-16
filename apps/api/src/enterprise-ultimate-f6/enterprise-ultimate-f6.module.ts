import { Module } from "@nestjs/common";
import { EnterpriseUltimateF6Controller } from "./enterprise-ultimate-f6.controller";
import { EnterpriseUltimateF6Service } from "./enterprise-ultimate-f6.service";

@Module({
  controllers: [EnterpriseUltimateF6Controller],
  providers: [EnterpriseUltimateF6Service],
  exports: [EnterpriseUltimateF6Service],
})
export class EnterpriseUltimateF6Module {}