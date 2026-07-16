import { Module } from "@nestjs/common";
import { HyperRuntimePlatformController } from "./hyper-runtime-platform.controller";
import { HyperRuntimePlatformService } from "./hyper-runtime-platform.service";

@Module({
  controllers: [HyperRuntimePlatformController],
  providers: [HyperRuntimePlatformService],
  exports: [HyperRuntimePlatformService],
})
export class HyperRuntimePlatformModule {}