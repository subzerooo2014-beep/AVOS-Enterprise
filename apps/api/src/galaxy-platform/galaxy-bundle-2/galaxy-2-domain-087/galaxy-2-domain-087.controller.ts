import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain087Service } from "./galaxy-2-domain-087.service";
import { Galaxy2Domain087ExecutionRequest } from "./galaxy-2-domain-087.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-087")
export class Galaxy2Domain087Controller {
  constructor(private readonly service: Galaxy2Domain087Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain087ExecutionRequest) {
    return this.service.execute(request);
  }
}