import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RefreshService } from "./refresh/refresh.service";
import { JwtService } from "./tokens/jwt.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly refresh: RefreshService,
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post("forgot-password")
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post("reset-password")
  reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }

  @Post("refresh")
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.refresh.refresh(JwtService.verify(dto.refreshToken));
  }

  @Get("me")
  me(@Req() req: any) {
    return req.user ?? null;
  }
}
