import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain035Service } from "./galaxy-2-domain-035.service";
import { Galaxy2Domain035ExecutionRequest } from "./galaxy-2-domain-035.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-035")
export class Galaxy2Domain035Controller {
  constructor(private readonly service: Galaxy2Domain035Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain035ExecutionRequest) {
    return this.service.execute(request);
  }
}