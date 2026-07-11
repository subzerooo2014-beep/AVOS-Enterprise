import {
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { MegaPack6BootstrapService } from "./mega-pack-6-bootstrap.service";
import { MegaPack6DashboardService } from "./mega-pack-6-dashboard.service";

@Controller(
  "production-hardening-v7/mega-pack-6",
)
export class MegaPack6Controller {
  constructor(
    private readonly bootstrapService:
      MegaPack6BootstrapService,
    private readonly dashboard:
      MegaPack6DashboardService,
  ) {}

  @Post("bootstrap")
  bootstrap() {
    return this.bootstrapService
      .bootstrap();
  }

  @Get("status")
  status() {
    return this.dashboard.status();
  }
}
