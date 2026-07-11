import { EventBusService } from "./event-bus.service";
export declare class EventBusController {
    private service;
    constructor(service: EventBusService);
    emit(body: any): Promise<any>;
    list(status?: string): any;
    processed(id: string, body: any): Promise<any>;
}
