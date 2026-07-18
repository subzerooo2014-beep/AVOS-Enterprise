import { Module } from "@nestjs/common";
import { FactoryRuntimeSmokeCapabilityService } from "./factory-runtime-smoke-capability.service";
import { FactoryRuntimeSmokeCapabilityController } from "./factory-runtime-smoke-capability.controller";

@Module({
  controllers: [FactoryRuntimeSmokeCapabilityController],
  providers: [FactoryRuntimeSmokeCapabilityService],
  exports: [FactoryRuntimeSmokeCapabilityService]
})
export class FactoryRuntimeSmokeCapabilityModule {}