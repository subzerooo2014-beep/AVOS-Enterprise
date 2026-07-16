import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HyperRuntimePlatformService } from "./hyper-runtime-platform.service";
import { HyperRuntimePlatformCapability } from "./hyper-runtime-platform.types";

@Controller("hyper-runtime-platform")
export class HyperRuntimePlatformController {
  constructor(private readonly service: HyperRuntimePlatformService) {}

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
    @Param("capability") capability: HyperRuntimePlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}