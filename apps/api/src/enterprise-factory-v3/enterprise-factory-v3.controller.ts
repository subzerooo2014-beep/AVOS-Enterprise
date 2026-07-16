import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseFactoryV3Service } from "./enterprise-factory-v3.service";
import { EnterpriseFactoryV3Capability } from "./enterprise-factory-v3.types";

@Controller("enterprise-factory-v3")
export class EnterpriseFactoryV3Controller {
  constructor(private readonly service: EnterpriseFactoryV3Service) {}

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
    @Param("capability") capability: EnterpriseFactoryV3Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}