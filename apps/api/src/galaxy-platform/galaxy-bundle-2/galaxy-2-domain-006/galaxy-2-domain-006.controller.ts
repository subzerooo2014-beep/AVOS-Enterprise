import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain006Service } from "./galaxy-2-domain-006.service";
import { Galaxy2Domain006ExecutionRequest } from "./galaxy-2-domain-006.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-006")
export class Galaxy2Domain006Controller {
  constructor(private readonly service: Galaxy2Domain006Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain006ExecutionRequest) {
    return this.service.execute(request);
  }
}