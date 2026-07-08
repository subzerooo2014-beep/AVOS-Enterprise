import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: CreateOrganizationDto): any;
    update(id: string, dto: UpdateOrganizationDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
