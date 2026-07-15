import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain095Service } from "./galaxy-2-domain-095.service";
import { Galaxy2Domain095ExecutionRequest } from "./galaxy-2-domain-095.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-095")
export class Galaxy2Domain095Controller {
  constructor(private readonly service: Galaxy2Domain095Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain095ExecutionRequest) {
    return this.service.execute(request);
  }
}