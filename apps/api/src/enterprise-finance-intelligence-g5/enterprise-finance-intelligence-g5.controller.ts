import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseFinanceIntelligenceG5Service } from "./enterprise-finance-intelligence-g5.service";
import { EnterpriseFinanceIntelligenceG5Capability } from "./enterprise-finance-intelligence-g5.types";

@Controller("enterprise-finance-intelligence-g5")
export class EnterpriseFinanceIntelligenceG5Controller {
  constructor(private readonly service: EnterpriseFinanceIntelligenceG5Service) {}

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
    @Param("capability") capability: EnterpriseFinanceIntelligenceG5Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}