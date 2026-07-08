import { AlertsService } from "./alerts.service";
export declare class AlertsController {
    private service;
    constructor(service: AlertsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
