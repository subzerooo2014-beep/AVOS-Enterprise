import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseFederationPlatformService } from "./enterprise-federation-platform.service";
import { EnterpriseFederationPlatformCapability } from "./enterprise-federation-platform.types";

@Controller("enterprise-federation-platform")
export class EnterpriseFederationPlatformController {
  constructor(private readonly service: EnterpriseFederationPlatformService) {}

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
    @Param("capability") capability: EnterpriseFederationPlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}