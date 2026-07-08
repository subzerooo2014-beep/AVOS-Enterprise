"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_service_1 = require("./password/password.service");
const jwt_service_1 = require("./tokens/jwt.service");
const password_reset_store_1 = require("./password/password-reset.store");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (exists)
            throw new common_1.ConflictException("Email already exists");
        const passwordHash = await password_service_1.PasswordService.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                name: dto.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        return {
            user,
            accessToken: jwt_service_1.JwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const ok = await password_service_1.PasswordService.verify(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const safeUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
        };
        return {
            user: safeUser,
            accessToken: jwt_service_1.JwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
        };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { ok: true };
        }
        const token = password_reset_store_1.PasswordResetStore.create(email);
        return {
            ok: true,
            resetToken: token,
        };
    }
    async resetPassword(token, password) {
        const email = password_reset_store_1.PasswordResetStore.consume(token);
        if (!email) {
            throw new common_1.UnauthorizedException("Invalid or expired reset token");
        }
        const passwordHash = await password_service_1.PasswordService.hash(password);
        await this.prisma.user.update({
            where: { email },
            data: { passwordHash },
        });
        return { reset: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map