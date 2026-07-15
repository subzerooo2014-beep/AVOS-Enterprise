import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain025Service } from "./galaxy-2-domain-025.service";
import { Galaxy2Domain025ExecutionRequest } from "./galaxy-2-domain-025.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-025")
export class Galaxy2Domain025Controller {
  constructor(private readonly service: Galaxy2Domain025Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain025ExecutionRequest) {
    return this.service.execute(request);
  }
}