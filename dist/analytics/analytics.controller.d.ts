import { AnalyticsService } from "./analytics.service";
export declare class AnalyticsController {
    private service;
    constructor(service: AnalyticsService);
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
