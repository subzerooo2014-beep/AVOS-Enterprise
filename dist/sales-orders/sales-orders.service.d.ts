import { SalesOrdersRepository } from "./sales-orders.repository";
import { SalesOrdersMapper } from "./sales-orders.mapper";
import { SalesOrdersSerializer } from "./sales-orders.serializer";
export declare class SalesOrdersService {
    private readonly repo;
    private readonly mapper;
    private readonly serializer;
    constructor(repo: SalesOrdersRepository, mapper: SalesOrdersMapper, serializer: SalesOrdersSerializer);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
}
