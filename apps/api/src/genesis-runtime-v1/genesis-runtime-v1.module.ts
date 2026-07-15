import { Module } from "@nestjs/common";

import { GenesisRuntimeV1Controller } from "./genesis-runtime-v1.controller";
import { GenesisRuntimeV1Service } from "./genesis-runtime-v1.service";

@Module({
  controllers: [GenesisRuntimeV1Controller],
  providers: [GenesisRuntimeV1Service],
  exports: [GenesisRuntimeV1Service],
})
export class GenesisRuntimeV1Module {}