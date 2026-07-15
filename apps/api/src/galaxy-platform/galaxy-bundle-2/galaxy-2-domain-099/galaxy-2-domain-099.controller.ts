import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain099Service } from "./galaxy-2-domain-099.service";
import { Galaxy2Domain099ExecutionRequest } from "./galaxy-2-domain-099.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-099")
export class Galaxy2Domain099Controller {
  constructor(private readonly service: Galaxy2Domain099Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain099ExecutionRequest) {
    return this.service.execute(request);
  }
}