import { WarehousesRepository } from "./warehouses.repository";
import { WarehousesMapper } from "./warehouses.mapper";
import { WarehousesSerializer } from "./warehouses.serializer";
export declare class WarehousesService {
    private readonly repo;
    private readonly mapper;
    private readonly serializer;
    constructor(repo: WarehousesRepository, mapper: WarehousesMapper, serializer: WarehousesSerializer);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
}
