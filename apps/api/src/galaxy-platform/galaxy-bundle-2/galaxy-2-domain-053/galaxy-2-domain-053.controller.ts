import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain053Service } from "./galaxy-2-domain-053.service";
import { Galaxy2Domain053ExecutionRequest } from "./galaxy-2-domain-053.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-053")
export class Galaxy2Domain053Controller {
  constructor(private readonly service: Galaxy2Domain053Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain053ExecutionRequest) {
    return this.service.execute(request);
  }
}