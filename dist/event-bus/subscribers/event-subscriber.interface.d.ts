import { AvosEvent } from "../contracts/avos-event.interface";
export interface EventSubscriber {
    supports(event: AvosEvent): boolean;
    handle(event: AvosEvent): Promise<void>;
}
