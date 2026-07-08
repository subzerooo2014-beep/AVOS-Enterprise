import { CalendarService } from "./calendar.service";
export declare class CalendarController {
    private service;
    constructor(service: CalendarService);
    findAll(): any;
    create(dto: any): any;
}
