import { Module } from "@nestjs/common";
import { EnterpriseFactoryV2Controller } from "./enterprise-factory-v2.controller";
import { EnterpriseFactoryV2Service } from "./enterprise-factory-v2.service";

@Module({
  controllers: [EnterpriseFactoryV2Controller],
  providers: [EnterpriseFactoryV2Service],
  exports: [EnterpriseFactoryV2Service],
})
export class EnterpriseFactoryV2Module {}