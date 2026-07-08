import { ReportsService } from "./reports.service";
export declare class ReportsController {
    private service;
    constructor(service: ReportsService);
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
