import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PasswordService } from "./password/password.service";
import { JwtService } from "./tokens/jwt.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PasswordResetStore } from "./password/password-reset.store";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException("Email already exists");

    const passwordHash = await PasswordService.hash(dto.password);

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
      accessToken: JwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await PasswordService.verify(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      user: safeUser,
      accessToken: JwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { ok: true };
    }

    const token = PasswordResetStore.create(email);

    return {
      ok: true,
      resetToken: token,
    };
  }

  async resetPassword(token: string, password: string) {
    const email = PasswordResetStore.consume(token);

    if (!email) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    const passwordHash = await PasswordService.hash(password);

    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return { reset: true };
  }
}
