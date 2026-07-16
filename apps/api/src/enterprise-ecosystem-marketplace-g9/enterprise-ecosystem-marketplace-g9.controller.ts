import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseEcosystemMarketplaceG9Service } from "./enterprise-ecosystem-marketplace-g9.service";
import { EnterpriseEcosystemMarketplaceG9Capability } from "./enterprise-ecosystem-marketplace-g9.types";

@Controller("enterprise-ecosystem-marketplace-g9")
export class EnterpriseEcosystemMarketplaceG9Controller {
  constructor(private readonly service: EnterpriseEcosystemMarketplaceG9Service) {}

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
    @Param("capability") capability: EnterpriseEcosystemMarketplaceG9Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}