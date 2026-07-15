import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain069Service } from "./galaxy-2-domain-069.service";
import { Galaxy2Domain069ExecutionRequest } from "./galaxy-2-domain-069.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-069")
export class Galaxy2Domain069Controller {
  constructor(private readonly service: Galaxy2Domain069Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain069ExecutionRequest) {
    return this.service.execute(request);
  }
}