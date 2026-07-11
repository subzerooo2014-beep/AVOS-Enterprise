import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(query: UserQueryDto): import("@prisma/client").Prisma.PrismaPromise<{
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
