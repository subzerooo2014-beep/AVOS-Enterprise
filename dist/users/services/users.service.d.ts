import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(): Prisma.PrismaPromise<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    remove(id: string): Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
