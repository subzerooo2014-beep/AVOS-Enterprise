import { Module } from "@nestjs/common";
import { FeaturePlatformController } from "./feature-platform.controller";
import { FeaturePlatformService } from "./feature-platform.service";

@Module({
  controllers: [FeaturePlatformController],
  providers: [FeaturePlatformService],
  exports: [FeaturePlatformService],
})
export class FeaturePlatformModule {}