import { EventSubscriber } from "../subscribers/event-subscriber.interface";
import { VehicleCreatedSubscriber } from "../subscribers/vehicle-created.subscriber";
import { AvosEvent } from "../contracts/avos-event.interface";
export declare class EventRegistryService {
    private vehicleCreated;
    constructor(vehicleCreated: VehicleCreatedSubscriber);
    getSubscribers(event: AvosEvent): EventSubscriber[];
}
