import { MetricsService } from "./metrics.service";
export declare class MetricsController {
    private service;
    constructor(service: MetricsService);
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
