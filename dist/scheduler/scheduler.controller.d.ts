import { SchedulerService } from "./scheduler.service";
export declare class SchedulerController {
    private service;
    constructor(service: SchedulerService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
