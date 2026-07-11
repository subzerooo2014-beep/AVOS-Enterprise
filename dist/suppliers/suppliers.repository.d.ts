import { PrismaService } from "../prisma/prisma.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get model();
    findAll(): any;
    findById(id: string): any;
    create(dto: CreateSupplierDto): any;
    update(id: string, dto: UpdateSupplierDto): any;
    remove(id: string): any;
}
