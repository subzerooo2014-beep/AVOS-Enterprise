import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  RuntimeGovernanceDashboardService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/dashboard",
)
export class RuntimeGovernanceDashboardController {
  constructor(
    private readonly dashboard:
      RuntimeGovernanceDashboardService,
  ) {}

  @Get()
  snapshot() {
    return this.dashboard
      .snapshot();
  }
}
