import { InventoryService } from "./inventory.service";
export declare class InventoryController {
    private service;
    constructor(service: InventoryService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
