import { WarehousesService } from "./warehouses.service";
export declare class WarehousesController {
    private readonly service;
    constructor(service: WarehousesService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
}
