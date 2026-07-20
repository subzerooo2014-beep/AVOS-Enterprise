import {
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { AdaptiveGrowthExecutionVerificationService } from "./adaptive-growth-execution-verification.service";

@Controller(
  "avos/products/adaptive-growth-studio/execution/verification",
)
export class AdaptiveGrowthExecutionVerificationController {
  constructor(
    private readonly verification:
      AdaptiveGrowthExecutionVerificationService,
  ) {}

  @Post("run")
  run() {
    return this.verification.run();
  }

  @Get("status")
  status() {
    return this.verification.status();
  }
}