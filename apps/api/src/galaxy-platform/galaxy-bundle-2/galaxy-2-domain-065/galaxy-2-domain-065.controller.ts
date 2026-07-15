import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain065Service } from "./galaxy-2-domain-065.service";
import { Galaxy2Domain065ExecutionRequest } from "./galaxy-2-domain-065.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-065")
export class Galaxy2Domain065Controller {
  constructor(private readonly service: Galaxy2Domain065Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain065ExecutionRequest) {
    return this.service.execute(request);
  }
}