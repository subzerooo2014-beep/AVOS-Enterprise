import { Injectable } from "@nestjs/common";
import { EventSubscriber } from "../subscribers/event-subscriber.interface";
import { VehicleCreatedSubscriber } from "../subscribers/vehicle-created.subscriber";
import { AvosEvent } from "../contracts/avos-event.interface";

@Injectable()
export class EventRegistryService {
  constructor(private vehicleCreated: VehicleCreatedSubscriber) {}

  getSubscribers(event: AvosEvent): EventSubscriber[] {
    return [this.vehicleCreated].filter((subscriber) => subscriber.supports(event));
  }
}
