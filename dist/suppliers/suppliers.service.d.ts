import { PrismaService } from "../prisma/prisma.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: CreateSupplierDto): any;
    update(id: string, dto: UpdateSupplierDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
