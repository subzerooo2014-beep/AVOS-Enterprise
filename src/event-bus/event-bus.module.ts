import { Module } from "@nestjs/common";
import { AvosBrainModule } from "../avos-brain/avos-brain.module";
import { EventBusService } from "./event-bus.service";
import { EventDispatcherService } from "./dispatcher/event-dispatcher.service";

@Module({
  imports: [AvosBrainModule],
  providers: [EventBusService, EventDispatcherService],
  exports: [EventBusService, EventDispatcherService],
})
export class EventBusModule {}
