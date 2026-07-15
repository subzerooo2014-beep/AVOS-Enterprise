import { Module } from "@nestjs/common";
import { PartnerPlatformController } from "./partner-platform.controller";
import { PartnerPlatformService } from "./partner-platform.service";

@Module({
  controllers: [PartnerPlatformController],
  providers: [PartnerPlatformService],
  exports: [PartnerPlatformService],
})
export class PartnerPlatformModule {}