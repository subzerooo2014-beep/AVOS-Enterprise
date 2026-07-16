import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseInnovationGrowthG8Service } from "./enterprise-innovation-growth-g8.service";
import { EnterpriseInnovationGrowthG8Capability } from "./enterprise-innovation-growth-g8.types";

@Controller("enterprise-innovation-growth-g8")
export class EnterpriseInnovationGrowthG8Controller {
  constructor(private readonly service: EnterpriseInnovationGrowthG8Service) {}

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
    @Param("capability") capability: EnterpriseInnovationGrowthG8Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}