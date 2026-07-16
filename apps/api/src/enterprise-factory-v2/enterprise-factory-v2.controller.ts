import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseFactoryV2Service } from "./enterprise-factory-v2.service";
import { EnterpriseFactoryV2Capability } from "./enterprise-factory-v2.types";

@Controller("enterprise-factory-v2")
export class EnterpriseFactoryV2Controller {
  constructor(private readonly service: EnterpriseFactoryV2Service) {}

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
    @Param("capability") capability: EnterpriseFactoryV2Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}