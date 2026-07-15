import { Module } from "@nestjs/common";
import { EnterpriseRuntimeV1Controller } from "./enterprise-runtime-v1.controller";
import { EnterpriseRuntimeV1Service } from "./enterprise-runtime-v1.service";

@Module({
  controllers: [EnterpriseRuntimeV1Controller],
  providers: [EnterpriseRuntimeV1Service],
  exports: [EnterpriseRuntimeV1Service],
})
export class EnterpriseRuntimeV1Module {}