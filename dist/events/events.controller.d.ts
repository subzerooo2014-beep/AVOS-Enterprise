import { EventsService } from "./events.service";
export declare class EventsController {
    private service;
    constructor(service: EventsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
