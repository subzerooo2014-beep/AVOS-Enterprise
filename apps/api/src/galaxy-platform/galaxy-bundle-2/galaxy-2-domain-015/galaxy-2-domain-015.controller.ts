import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain015Service } from "./galaxy-2-domain-015.service";
import { Galaxy2Domain015ExecutionRequest } from "./galaxy-2-domain-015.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-015")
export class Galaxy2Domain015Controller {
  constructor(private readonly service: Galaxy2Domain015Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain015ExecutionRequest) {
    return this.service.execute(request);
  }
}