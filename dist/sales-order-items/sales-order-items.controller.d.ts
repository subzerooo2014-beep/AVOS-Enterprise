import { SalesOrderItemsService } from "./sales-order-items.service";
export declare class SalesOrderItemsController {
    private readonly service;
    constructor(service: SalesOrderItemsService);
    findAll(orderId: string): any;
    create(dto: any): any;
}
