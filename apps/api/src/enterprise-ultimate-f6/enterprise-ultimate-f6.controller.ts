import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseUltimateF6Service } from "./enterprise-ultimate-f6.service";
import { EnterpriseUltimateF6Capability } from "./enterprise-ultimate-f6.types";

@Controller("enterprise-ultimate-f6")
export class EnterpriseUltimateF6Controller {
  constructor(private readonly service: EnterpriseUltimateF6Service) {}

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
    @Param("capability") capability: EnterpriseUltimateF6Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}