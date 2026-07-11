import { SuppliersRepository } from "./suppliers.repository";
import { SuppliersMapper } from "./suppliers.mapper";
import { SuppliersSerializer } from "./suppliers.serializer";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersService {
    private readonly repo;
    private readonly mapper;
    private readonly serializer;
    constructor(repo: SuppliersRepository, mapper: SuppliersMapper, serializer: SuppliersSerializer);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateSupplierDto): Promise<any>;
    update(id: string, dto: UpdateSupplierDto): Promise<any>;
    remove(id: string): Promise<any>;
}
