import { PurchaseOrderItemsRepository } from "./purchase-order-items.repository";
import { PurchaseOrderItemsMapper } from "./purchase-order-items.mapper";
export declare class PurchaseOrderItemsService {
    private readonly repo;
    private readonly mapper;
    constructor(repo: PurchaseOrderItemsRepository, mapper: PurchaseOrderItemsMapper);
    findAll(orderId: string): any;
    create(dto: any): any;
}
