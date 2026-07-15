import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain029Service } from "./galaxy-2-domain-029.service";
import { Galaxy2Domain029ExecutionRequest } from "./galaxy-2-domain-029.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-029")
export class Galaxy2Domain029Controller {
  constructor(private readonly service: Galaxy2Domain029Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain029ExecutionRequest) {
    return this.service.execute(request);
  }
}