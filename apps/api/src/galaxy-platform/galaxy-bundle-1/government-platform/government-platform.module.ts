import { Module } from "@nestjs/common";
import { GovernmentPlatformController } from "./government-platform.controller";
import { GovernmentPlatformService } from "./government-platform.service";

@Module({
  controllers: [GovernmentPlatformController],
  providers: [GovernmentPlatformService],
  exports: [GovernmentPlatformService],
})
export class GovernmentPlatformModule {}