import { SalesOrderItemsRepository } from "./sales-order-items.repository";
import { SalesOrderItemsMapper } from "./sales-order-items.mapper";
export declare class SalesOrderItemsService {
    private readonly repo;
    private readonly mapper;
    constructor(repo: SalesOrderItemsRepository, mapper: SalesOrderItemsMapper);
    findAll(orderId: string): any;
    create(dto: any): any;
}
