import { MonitoringService } from "./monitoring.service";
export declare class MonitoringController {
    private service;
    constructor(service: MonitoringService);
    findAll(): never[];
    findOne(id: string): {
        id: string;
    };
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        deleted: boolean;
        id: string;
    };
}
