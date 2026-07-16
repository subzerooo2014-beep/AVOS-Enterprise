import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UltimateStrategyPlatformService } from "./ultimate-strategy-platform.service";
import { UltimateStrategyPlatformCapability } from "./ultimate-strategy-platform.types";

@Controller("ultimate-strategy-platform")
export class UltimateStrategyPlatformController {
  constructor(private readonly service: UltimateStrategyPlatformService) {}

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
    @Param("capability") capability: UltimateStrategyPlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}