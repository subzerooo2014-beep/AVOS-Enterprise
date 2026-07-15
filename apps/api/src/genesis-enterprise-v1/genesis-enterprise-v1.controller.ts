import { Body, Controller, Get, Post } from "@nestjs/common";
import { GenesisEnterpriseV1Service } from "./genesis-enterprise-v1.service";

@Controller("genesis-enterprise-v1")
export class GenesisEnterpriseV1Controller {
  constructor(private readonly service: GenesisEnterpriseV1Service) {}

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