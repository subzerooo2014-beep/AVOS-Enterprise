import { Module } from "@nestjs/common";
import { GlobalIntelligencePlatformController } from "./global-intelligence-platform.controller";
import { GlobalIntelligencePlatformService } from "./global-intelligence-platform.service";

@Module({
  controllers: [GlobalIntelligencePlatformController],
  providers: [GlobalIntelligencePlatformService],
  exports: [GlobalIntelligencePlatformService],
})
export class GlobalIntelligencePlatformModule {}