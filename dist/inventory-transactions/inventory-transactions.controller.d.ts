import { InventoryTransactionsService } from "./inventory-transactions.service";
export declare class InventoryTransactionsController {
    private readonly service;
    constructor(service: InventoryTransactionsService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
}
