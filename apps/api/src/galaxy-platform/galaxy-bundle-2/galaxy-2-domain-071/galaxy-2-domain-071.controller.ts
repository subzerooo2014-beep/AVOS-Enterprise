import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain071Service } from "./galaxy-2-domain-071.service";
import { Galaxy2Domain071ExecutionRequest } from "./galaxy-2-domain-071.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-071")
export class Galaxy2Domain071Controller {
  constructor(private readonly service: Galaxy2Domain071Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain071ExecutionRequest) {
    return this.service.execute(request);
  }
}