import { UsersService } from "../services/users.service";
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    create(body: any): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    update(id: string, body: any): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
