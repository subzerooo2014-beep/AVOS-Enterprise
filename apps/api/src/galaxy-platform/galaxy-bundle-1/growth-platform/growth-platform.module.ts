import { Module } from "@nestjs/common";
import { GrowthPlatformController } from "./growth-platform.controller";
import { GrowthPlatformService } from "./growth-platform.service";

@Module({
  controllers: [GrowthPlatformController],
  providers: [GrowthPlatformService],
  exports: [GrowthPlatformService],
})
export class GrowthPlatformModule {}