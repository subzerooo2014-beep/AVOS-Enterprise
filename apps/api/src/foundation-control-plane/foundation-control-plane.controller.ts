import { Controller, Get } from "@nestjs/common";
import { FoundationControlPlaneService } from "./foundation-control-plane.service";

@Controller("foundation-control")
export class FoundationControlPlaneController {
  constructor(private readonly service: FoundationControlPlaneService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("registry")
  registry() {
    return this.service.registry();
  }

  @Get("health")
  health() {
    return this.service.health();
  }
}
