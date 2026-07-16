import { Module } from "@nestjs/common";
import { EnterpriseUltimateF3Controller } from "./enterprise-ultimate-f3.controller";
import { EnterpriseUltimateF3Service } from "./enterprise-ultimate-f3.service";

@Module({
  controllers: [EnterpriseUltimateF3Controller],
  providers: [EnterpriseUltimateF3Service],
  exports: [EnterpriseUltimateF3Service],
})
export class EnterpriseUltimateF3Module {}