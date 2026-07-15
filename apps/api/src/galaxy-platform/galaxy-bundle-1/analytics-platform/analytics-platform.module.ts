import { Module } from "@nestjs/common";
import { AnalyticsPlatformController } from "./analytics-platform.controller";
import { AnalyticsPlatformService } from "./analytics-platform.service";

@Module({
  controllers: [AnalyticsPlatformController],
  providers: [AnalyticsPlatformService],
  exports: [AnalyticsPlatformService],
})
export class AnalyticsPlatformModule {}