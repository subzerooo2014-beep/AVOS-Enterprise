import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersController {
    private readonly service;
    constructor(service: SuppliersService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateSupplierDto): Promise<any>;
    update(id: string, dto: UpdateSupplierDto): Promise<any>;
    remove(id: string): Promise<any>;
}
