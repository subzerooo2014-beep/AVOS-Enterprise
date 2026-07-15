import { Module } from "@nestjs/common";
import { CommercePlatformController } from "./commerce-platform.controller";
import { CommercePlatformService } from "./commerce-platform.service";

@Module({
  controllers: [CommercePlatformController],
  providers: [CommercePlatformService],
  exports: [CommercePlatformService],
})
export class CommercePlatformModule {}