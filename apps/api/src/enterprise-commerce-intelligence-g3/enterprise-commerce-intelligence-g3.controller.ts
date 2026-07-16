import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseCommerceIntelligenceG3Service } from "./enterprise-commerce-intelligence-g3.service";
import { EnterpriseCommerceIntelligenceG3Capability } from "./enterprise-commerce-intelligence-g3.types";

@Controller("enterprise-commerce-intelligence-g3")
export class EnterpriseCommerceIntelligenceG3Controller {
  constructor(private readonly service: EnterpriseCommerceIntelligenceG3Service) {}

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
    @Param("capability") capability: EnterpriseCommerceIntelligenceG3Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}