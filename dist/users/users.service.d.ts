import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        search?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
