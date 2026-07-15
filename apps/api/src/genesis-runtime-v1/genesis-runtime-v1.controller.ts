import { Body, Controller, Get, Post } from "@nestjs/common";
import { GenesisRuntimeV1Service } from "./genesis-runtime-v1.service";

@Controller("genesis-runtime-v1")
export class GenesisRuntimeV1Controller {
  constructor(private readonly service: GenesisRuntimeV1Service) {}

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