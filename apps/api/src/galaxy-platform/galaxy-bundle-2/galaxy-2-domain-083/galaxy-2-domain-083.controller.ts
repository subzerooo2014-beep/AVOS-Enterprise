import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain083Service } from "./galaxy-2-domain-083.service";
import { Galaxy2Domain083ExecutionRequest } from "./galaxy-2-domain-083.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-083")
export class Galaxy2Domain083Controller {
  constructor(private readonly service: Galaxy2Domain083Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain083ExecutionRequest) {
    return this.service.execute(request);
  }
}