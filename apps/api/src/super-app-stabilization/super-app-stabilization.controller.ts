import { Controller, Get } from "@nestjs/common";
import { SuperAppStabilizationService } from "./super-app-stabilization.service";

@Controller("super-app-stabilization")
export class SuperAppStabilizationController {
  constructor(
    private readonly stabilization: SuperAppStabilizationService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Super App Stabilization",
      status: "healthy",
    };
  }

  @Get("report")
  report() {
    return this.stabilization.report();
  }
}
