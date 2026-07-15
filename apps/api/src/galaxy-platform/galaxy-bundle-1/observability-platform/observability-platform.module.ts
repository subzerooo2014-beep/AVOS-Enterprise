import { Module } from "@nestjs/common";
import { ObservabilityPlatformController } from "./observability-platform.controller";
import { ObservabilityPlatformService } from "./observability-platform.service";

@Module({
  controllers: [ObservabilityPlatformController],
  providers: [ObservabilityPlatformService],
  exports: [ObservabilityPlatformService],
})
export class ObservabilityPlatformModule {}