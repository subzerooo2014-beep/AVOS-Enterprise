import { Module } from "@nestjs/common";
import { EventPlatformController } from "./event-platform.controller";
import { EventPlatformService } from "./event-platform.service";

@Module({
  controllers: [EventPlatformController],
  providers: [EventPlatformService],
  exports: [EventPlatformService],
})
export class EventPlatformModule {}