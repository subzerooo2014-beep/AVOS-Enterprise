import { Module } from "@nestjs/common";

import { GenesisEnterpriseV1Controller } from "./genesis-enterprise-v1.controller";
import { GenesisEnterpriseV1Service } from "./genesis-enterprise-v1.service";

@Module({
  controllers: [GenesisEnterpriseV1Controller],
  providers: [GenesisEnterpriseV1Service],
  exports: [GenesisEnterpriseV1Service],
})
export class GenesisEnterpriseV1Module {}