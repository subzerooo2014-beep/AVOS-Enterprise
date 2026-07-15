import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain026Service } from "./galaxy-2-domain-026.service";
import { Galaxy2Domain026ExecutionRequest } from "./galaxy-2-domain-026.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-026")
export class Galaxy2Domain026Controller {
  constructor(private readonly service: Galaxy2Domain026Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain026ExecutionRequest) {
    return this.service.execute(request);
  }
}