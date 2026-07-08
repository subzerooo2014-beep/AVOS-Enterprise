import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
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
