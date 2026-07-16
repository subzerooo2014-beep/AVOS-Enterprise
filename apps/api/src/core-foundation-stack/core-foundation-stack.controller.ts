import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CoreFoundationStackService } from "./core-foundation-stack.service";
import { CoreFoundationStackCapability } from "./core-foundation-stack.types";

@Controller("core-foundation-stack")
export class CoreFoundationStackController {
  constructor(private readonly service: CoreFoundationStackService) {}

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
    @Param("capability") capability: CoreFoundationStackCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}