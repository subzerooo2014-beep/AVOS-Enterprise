import { Module } from "@nestjs/common";
import { GovernancePlatformController } from "./governance-platform.controller";
import { GovernancePlatformService } from "./governance-platform.service";

@Module({
  controllers: [GovernancePlatformController],
  providers: [GovernancePlatformService],
  exports: [GovernancePlatformService],
})
export class GovernancePlatformModule {}