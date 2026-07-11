import { PurchaseOrdersRepository } from "./purchase-orders.repository";
import { PurchaseOrdersMapper } from "./purchase-orders.mapper";
import { PurchaseOrdersSerializer } from "./purchase-orders.serializer";
export declare class PurchaseOrdersService {
    private readonly repo;
    private readonly mapper;
    private readonly serializer;
    constructor(repo: PurchaseOrdersRepository, mapper: PurchaseOrdersMapper, serializer: PurchaseOrdersSerializer);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
}
