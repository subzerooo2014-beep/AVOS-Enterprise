import {
  Controller,
  Get,
} from "@nestjs/common";
import { RuntimeResilienceVerificationService } from "../verification/runtime-resilience-verification.service";

@Controller("production-hardening-v8-mega-pack-3/verification")
export class RuntimeResilienceVerificationController {
  constructor(
    private readonly verification:
      RuntimeResilienceVerificationService,
  ) {}

  @Get()
  verify() {
    return this.verification.verify();
  }
}
