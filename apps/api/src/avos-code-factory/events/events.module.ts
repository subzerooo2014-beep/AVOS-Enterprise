import { Module } from "@nestjs/common";
import { FactoryEventBusService } from "./event-bus.service";
import { FactoryEventDispatcherService } from "./event-dispatcher.service";
import { FactoryEventStoreService } from "./event-store.service";
import { FactoryEventSubscriberService } from "./event-subscriber.service";

@Module({
  providers: [
    FactoryEventBusService,
    FactoryEventDispatcherService,
    FactoryEventStoreService,
    FactoryEventSubscriberService,
  ],
  exports: [
    FactoryEventBusService,
    FactoryEventDispatcherService,
    FactoryEventStoreService,
    FactoryEventSubscriberService,
  ],
})
export class FactoryEventsModule {}
