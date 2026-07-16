import { Module } from "@nestjs/common";
import { EnterpriseFactoryV1Controller } from "./enterprise-factory-v1.controller";
import { EnterpriseFactoryV1Service } from "./enterprise-factory-v1.service";

@Module({
  controllers: [EnterpriseFactoryV1Controller],
  providers: [EnterpriseFactoryV1Service],
  exports: [EnterpriseFactoryV1Service],
})
export class EnterpriseFactoryV1Module {}