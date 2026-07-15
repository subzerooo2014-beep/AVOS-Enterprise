import { Module } from "@nestjs/common";
import { CommercialLaunchController } from "./commercial-launch.controller";
import { CommercialLaunchService } from "./commercial-launch.service";

@Module({
  controllers: [CommercialLaunchController],
  providers: [CommercialLaunchService],
  exports: [CommercialLaunchService],
})
export class CommercialLaunchModule {}