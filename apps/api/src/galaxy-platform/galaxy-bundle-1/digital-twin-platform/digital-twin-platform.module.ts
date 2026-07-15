import { Module } from "@nestjs/common";
import { DigitalTwinPlatformController } from "./digital-twin-platform.controller";
import { DigitalTwinPlatformService } from "./digital-twin-platform.service";

@Module({
  controllers: [DigitalTwinPlatformController],
  providers: [DigitalTwinPlatformService],
  exports: [DigitalTwinPlatformService],
})
export class DigitalTwinPlatformModule {}