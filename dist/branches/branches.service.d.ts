import { PrismaService } from "../prisma/prisma.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: CreateBranchDto): any;
    update(id: string, dto: UpdateBranchDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
