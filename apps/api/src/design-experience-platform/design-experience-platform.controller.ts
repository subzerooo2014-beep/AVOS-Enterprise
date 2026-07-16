import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DesignExperiencePlatformService } from "./design-experience-platform.service";
import { DesignExperiencePlatformCapability } from "./design-experience-platform.types";

@Controller("design-experience-platform")
export class DesignExperiencePlatformController {
  constructor(private readonly service: DesignExperiencePlatformService) {}

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
    @Param("capability") capability: DesignExperiencePlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}