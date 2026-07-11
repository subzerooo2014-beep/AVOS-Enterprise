import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            role: import("@prisma/client").$Enums.Role;
            email: string;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        ok: boolean;
        resetToken?: undefined;
    } | {
        ok: boolean;
        resetToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    resetPassword(token: string, password: string): Promise<{
        reset: boolean;
    }>;
}
