import { HealthService } from "./health.service";
export declare class HealthController {
    private service;
    constructor(service: HealthService);
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
