import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain030Service } from "./galaxy-2-domain-030.service";
import { Galaxy2Domain030ExecutionRequest } from "./galaxy-2-domain-030.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-030")
export class Galaxy2Domain030Controller {
  constructor(private readonly service: Galaxy2Domain030Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain030ExecutionRequest) {
    return this.service.execute(request);
  }
}