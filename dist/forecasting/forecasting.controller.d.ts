import { ForecastingService } from "./forecasting.service";
export declare class ForecastingController {
    private service;
    constructor(service: ForecastingService);
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
