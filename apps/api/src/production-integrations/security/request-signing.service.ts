import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

@Injectable()
export class RequestSigningService {
  sign(payload: Record<string, unknown>, secret: string) {
    return createHash("sha256").update(JSON.stringify(payload) + secret).digest("hex");
  }
  verify(payload: Record<string, unknown>, secret: string, signature: string) {
    return this.sign(payload, secret) === signature;
  }
}
