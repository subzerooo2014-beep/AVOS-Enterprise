import { Module } from "@nestjs/common";
import { EnterpriseFactoryV3Controller } from "./enterprise-factory-v3.controller";
import { EnterpriseFactoryV3Service } from "./enterprise-factory-v3.service";

@Module({
  controllers: [EnterpriseFactoryV3Controller],
  providers: [EnterpriseFactoryV3Service],
  exports: [EnterpriseFactoryV3Service],
})
export class EnterpriseFactoryV3Module {}