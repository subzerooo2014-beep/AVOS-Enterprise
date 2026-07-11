import {
  Controller,
  Post,
} from "@nestjs/common";
import {
  ProductionHardeningV8MegaPack4VerificationService,
} from "../verification/production-hardening-v8-mega-pack-4-verification.service";

@Controller(
  "production-hardening-v8-mega-pack-4/verification",
)
export class ProductionHardeningV8MegaPack4VerificationController {
  constructor(
    private readonly verification:
      ProductionHardeningV8MegaPack4VerificationService,
  ) {}

  @Post("run")
  run() {
    return this.verification.run();
  }
}
