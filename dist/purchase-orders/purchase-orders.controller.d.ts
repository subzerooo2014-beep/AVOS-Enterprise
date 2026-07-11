import { PurchaseOrdersService } from "./purchase-orders.service";
export declare class PurchaseOrdersController {
    private readonly service;
    constructor(service: PurchaseOrdersService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
}
