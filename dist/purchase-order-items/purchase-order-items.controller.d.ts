import { PurchaseOrderItemsService } from "./purchase-order-items.service";
export declare class PurchaseOrderItemsController {
    private readonly service;
    constructor(service: PurchaseOrderItemsService);
    findAll(orderId: string): any;
    create(dto: any): any;
}
