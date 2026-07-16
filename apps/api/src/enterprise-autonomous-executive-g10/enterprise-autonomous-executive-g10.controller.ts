import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseAutonomousExecutiveG10Service } from "./enterprise-autonomous-executive-g10.service";
import { EnterpriseAutonomousExecutiveG10Capability } from "./enterprise-autonomous-executive-g10.types";

@Controller("enterprise-autonomous-executive-g10")
export class EnterpriseAutonomousExecutiveG10Controller {
  constructor(private readonly service: EnterpriseAutonomousExecutiveG10Service) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Post("execute/:capability")
  execute(
    @Param("capability") capability: EnterpriseAutonomousExecutiveG10Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}