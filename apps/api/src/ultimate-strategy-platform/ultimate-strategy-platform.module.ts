import { Module } from "@nestjs/common";
import { UltimateStrategyPlatformController } from "./ultimate-strategy-platform.controller";
import { UltimateStrategyPlatformService } from "./ultimate-strategy-platform.service";

@Module({
  controllers: [UltimateStrategyPlatformController],
  providers: [UltimateStrategyPlatformService],
  exports: [UltimateStrategyPlatformService],
})
export class UltimateStrategyPlatformModule {}