import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseMetadataPlatformService } from "./enterprise-metadata-platform.service";
import { EnterpriseMetadataPlatformCapability } from "./enterprise-metadata-platform.types";

@Controller("enterprise-metadata-platform")
export class EnterpriseMetadataPlatformController {
  constructor(private readonly service: EnterpriseMetadataPlatformService) {}

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
    @Param("capability") capability: EnterpriseMetadataPlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}