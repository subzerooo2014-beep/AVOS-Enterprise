import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterprisePlatformUltimateService } from "./enterprise-platform-ultimate.service";
import {
  EnterpriseCapability,
  EnterpriseDomain,
  EnterpriseMarketplaceItem,
  EnterprisePolicy,
} from "./enterprise-platform-ultimate.types";

@Controller("enterprise-platform-ultimate")
export class EnterprisePlatformUltimateController {
  constructor(private readonly platform: EnterprisePlatformUltimateService) {}

  @Get()
  framework() {
    return this.platform.framework();
  }

  @Post(":domain/capabilities")
  registerCapability(
    @Param("domain") domain: EnterpriseDomain,
    @Body()
    input: Omit<
      EnterpriseCapability,
      "id" | "domain" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.platform.registerCapability(domain, input);
  }

  @Patch("capabilities/:id/activate")
  activateCapability(@Param("id") id: string) {
    return this.platform.activateCapability(id);
  }

  @Post("capabilities/:id/execute")
  execute(
    @Param("id") id: string,
    @Body() body: { action: string; payload: Record<string, unknown> },
  ) {
    return this.platform.execute(id, body.action, body.payload);
  }

  @Post("policies")
  registerPolicy(
    @Body()
    input: Omit<EnterprisePolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerPolicy(input);
  }

  @Post("marketplace/items")
  publishMarketplaceItem(
    @Body()
    input: Omit<
      EnterpriseMarketplaceItem,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.platform.publishMarketplaceItem(input);
  }

  @Get("capabilities")
  listCapabilities(@Query("domain") domain?: EnterpriseDomain) {
    return this.platform.listCapabilities(domain);
  }

  @Get("command-center")
  commandCenter() {
    return this.platform.commandCenter();
  }
}