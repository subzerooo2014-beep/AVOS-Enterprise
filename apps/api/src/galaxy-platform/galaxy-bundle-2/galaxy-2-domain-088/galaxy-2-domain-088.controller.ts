import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain088Service } from "./galaxy-2-domain-088.service";
import { Galaxy2Domain088ExecutionRequest } from "./galaxy-2-domain-088.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-088")
export class Galaxy2Domain088Controller {
  constructor(private readonly service: Galaxy2Domain088Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain088ExecutionRequest) {
    return this.service.execute(request);
  }
}