import { Module } from "@nestjs/common";
import { EnterpriseUltimateF1Controller } from "./enterprise-ultimate-f1.controller";
import { EnterpriseUltimateF1Service } from "./enterprise-ultimate-f1.service";

@Module({
  controllers: [EnterpriseUltimateF1Controller],
  providers: [EnterpriseUltimateF1Service],
  exports: [EnterpriseUltimateF1Service],
})
export class EnterpriseUltimateF1Module {}