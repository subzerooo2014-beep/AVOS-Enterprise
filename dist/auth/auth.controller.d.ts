import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RefreshService } from "./refresh/refresh.service";
export declare class AuthController {
    private readonly auth;
    private readonly refresh;
    constructor(auth: AuthService, refresh: RefreshService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            name: string | null;
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
    forgot(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
        resetToken?: undefined;
    } | {
        ok: boolean;
        resetToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        reset: boolean;
    }>;
    refreshToken(dto: RefreshTokenDto): {
        accessToken: string;
    };
    me(req: any): any;
}
