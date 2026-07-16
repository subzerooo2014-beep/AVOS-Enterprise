import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseFactoryV1Service } from "./enterprise-factory-v1.service";
import { EnterpriseFactoryV1Capability } from "./enterprise-factory-v1.types";

@Controller("enterprise-factory-v1")
export class EnterpriseFactoryV1Controller {
  constructor(private readonly service: EnterpriseFactoryV1Service) {}

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
    @Param("capability") capability: EnterpriseFactoryV1Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}