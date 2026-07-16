import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseCustomerIntelligenceG4Service } from "./enterprise-customer-intelligence-g4.service";
import { EnterpriseCustomerIntelligenceG4Capability } from "./enterprise-customer-intelligence-g4.types";

@Controller("enterprise-customer-intelligence-g4")
export class EnterpriseCustomerIntelligenceG4Controller {
  constructor(private readonly service: EnterpriseCustomerIntelligenceG4Service) {}

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
    @Param("capability") capability: EnterpriseCustomerIntelligenceG4Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}