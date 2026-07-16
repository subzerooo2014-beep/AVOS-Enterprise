import { Module } from "@nestjs/common";
import { EnterpriseUltimateG1Controller } from "./enterprise-ultimate-g1.controller";
import { EnterpriseUltimateG1Service } from "./enterprise-ultimate-g1.service";

@Module({
  controllers: [EnterpriseUltimateG1Controller],
  providers: [EnterpriseUltimateG1Service],
  exports: [EnterpriseUltimateG1Service],
})
export class EnterpriseUltimateG1Module {}