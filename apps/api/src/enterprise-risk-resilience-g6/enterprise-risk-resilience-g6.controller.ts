import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseRiskResilienceG6Service } from "./enterprise-risk-resilience-g6.service";
import { EnterpriseRiskResilienceG6Capability } from "./enterprise-risk-resilience-g6.types";

@Controller("enterprise-risk-resilience-g6")
export class EnterpriseRiskResilienceG6Controller {
  constructor(private readonly service: EnterpriseRiskResilienceG6Service) {}

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
    @Param("capability") capability: EnterpriseRiskResilienceG6Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}