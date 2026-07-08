import { Injectable } from "@nestjs/common";
import { JwtService } from "../tokens/jwt.service";

@Injectable()
export class RefreshTokenService {
  generate(userId: string, role: string) {
    return JwtService.sign({
      sub: userId,
      role,
      type: "refresh",
    });
  }
}

