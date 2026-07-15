import { Body, Controller, Get, Post } from "@nestjs/common";
import { GenesisCoreV1Service } from "./genesis-core-v1.service";

@Controller("genesis-core-v1")
export class GenesisCoreV1Controller {
  constructor(private readonly service: GenesisCoreV1Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("blueprints")
  createBlueprint(@Body() body: Record<string, unknown>) {
    return this.service.createBlueprint(body);
  }

  @Post("executions")
  execute(@Body() body: Record<string, unknown>) {
    return this.service.execute(body);
  }

  @Get("command-center")
  commandCenter() {
    return this.service.commandCenter();
  }
}