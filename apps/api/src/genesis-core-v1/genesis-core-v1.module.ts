import { Module } from "@nestjs/common";

import { GenesisCoreV1Controller } from "./genesis-core-v1.controller";
import { GenesisCoreV1Service } from "./genesis-core-v1.service";

@Module({
  controllers: [GenesisCoreV1Controller],
  providers: [GenesisCoreV1Service],
  exports: [GenesisCoreV1Service],
})
export class GenesisCoreV1Module {}