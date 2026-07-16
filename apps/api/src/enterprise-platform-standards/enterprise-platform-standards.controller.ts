import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterprisePlatformStandardsService } from "./enterprise-platform-standards.service";
import { EnterprisePlatformStandardsCapability } from "./enterprise-platform-standards.types";

@Controller("enterprise-platform-standards")
export class EnterprisePlatformStandardsController {
  constructor(private readonly service: EnterprisePlatformStandardsService) {}

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
    @Param("capability") capability: EnterprisePlatformStandardsCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}