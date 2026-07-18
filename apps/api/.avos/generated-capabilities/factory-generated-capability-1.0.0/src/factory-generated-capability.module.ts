import { Module } from "@nestjs/common";
import { FactoryGeneratedCapabilityService } from "./factory-generated-capability.service";
import { FactoryGeneratedCapabilityController } from "./factory-generated-capability.controller";

@Module({
  controllers: [FactoryGeneratedCapabilityController],
  providers: [FactoryGeneratedCapabilityService],
  exports: [FactoryGeneratedCapabilityService]
})
export class FactoryGeneratedCapabilityModule {}