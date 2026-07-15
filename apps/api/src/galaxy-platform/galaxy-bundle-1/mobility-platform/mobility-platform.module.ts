import { Module } from "@nestjs/common";
import { MobilityPlatformController } from "./mobility-platform.controller";
import { MobilityPlatformService } from "./mobility-platform.service";

@Module({
  controllers: [MobilityPlatformController],
  providers: [MobilityPlatformService],
  exports: [MobilityPlatformService],
})
export class MobilityPlatformModule {}