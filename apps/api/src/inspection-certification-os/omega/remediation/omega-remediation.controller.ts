import { Controller, Get, Post } from "@nestjs/common";
import { OmegaRemediationFacadeService } from "./omega-remediation-facade.service";

@Controller("inspection-certification/omega/remediation")
export class OmegaRemediationController {
  constructor(
    private readonly facade: OmegaRemediationFacadeService,
  ) {}

  @Get("status")
  status() {
    return this.facade.status();
  }

  @Post("plan")
  plan() {
    return this.facade.generatePlan();
  }

  @Get("latest")
  latest() {
    return this.facade.latest();
  }

  @Get("registry")
  registry() {
    return this.facade.registry();
  }
}
