import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseGlobalOperationsG2Service } from "./enterprise-global-operations-g2.service";
import { EnterpriseGlobalOperationsG2Capability } from "./enterprise-global-operations-g2.types";

@Controller("enterprise-global-operations-g2")
export class EnterpriseGlobalOperationsG2Controller {
  constructor(private readonly service: EnterpriseGlobalOperationsG2Service) {}

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
    @Param("capability") capability: EnterpriseGlobalOperationsG2Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}