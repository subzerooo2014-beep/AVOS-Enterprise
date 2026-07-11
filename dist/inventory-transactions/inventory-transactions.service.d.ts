import { InventoryTransactionsRepository } from "./inventory-transactions.repository";
import { InventoryTransactionsMapper } from "./inventory-transactions.mapper";
import { InventoryTransactionsSerializer } from "./inventory-transactions.serializer";
export declare class InventoryTransactionsService {
    private readonly repo;
    private readonly mapper;
    private readonly serializer;
    constructor(repo: InventoryTransactionsRepository, mapper: InventoryTransactionsMapper, serializer: InventoryTransactionsSerializer);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
}
