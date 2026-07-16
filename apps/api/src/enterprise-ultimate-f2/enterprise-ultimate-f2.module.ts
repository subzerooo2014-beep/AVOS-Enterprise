import { Module } from "@nestjs/common";
import { EnterpriseUltimateF2Controller } from "./enterprise-ultimate-f2.controller";
import { EnterpriseUltimateF2Service } from "./enterprise-ultimate-f2.service";

@Module({
  controllers: [EnterpriseUltimateF2Controller],
  providers: [EnterpriseUltimateF2Service],
  exports: [EnterpriseUltimateF2Service],
})
export class EnterpriseUltimateF2Module {}