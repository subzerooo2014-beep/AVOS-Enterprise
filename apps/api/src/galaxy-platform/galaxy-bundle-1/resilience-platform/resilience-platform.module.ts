import { Module } from "@nestjs/common";
import { ResiliencePlatformController } from "./resilience-platform.controller";
import { ResiliencePlatformService } from "./resilience-platform.service";

@Module({
  controllers: [ResiliencePlatformController],
  providers: [ResiliencePlatformService],
  exports: [ResiliencePlatformService],
})
export class ResiliencePlatformModule {}