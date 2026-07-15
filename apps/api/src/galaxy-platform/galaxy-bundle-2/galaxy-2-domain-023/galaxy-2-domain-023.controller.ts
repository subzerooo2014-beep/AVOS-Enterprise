import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain023Service } from "./galaxy-2-domain-023.service";
import { Galaxy2Domain023ExecutionRequest } from "./galaxy-2-domain-023.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-023")
export class Galaxy2Domain023Controller {
  constructor(private readonly service: Galaxy2Domain023Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain023ExecutionRequest) {
    return this.service.execute(request);
  }
}