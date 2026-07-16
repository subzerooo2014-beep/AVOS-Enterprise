import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { {{SERVICE_NAME}} } from "./{{MODULE_SLUG}}.service";
import { {{TYPE_NAME}} } from "./{{MODULE_SLUG}}.types";

@Controller("{{MODULE_SLUG}}")
export class {{CONTROLLER_NAME}} {
  constructor(private readonly service: {{SERVICE_NAME}}) {}

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
    @Param("capability") capability: {{TYPE_NAME}},
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}