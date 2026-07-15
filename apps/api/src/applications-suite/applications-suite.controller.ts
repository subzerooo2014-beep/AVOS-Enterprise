import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApplicationsSuiteService } from "./applications-suite.service";
import { AvosApplicationExecutionRequest } from "./applications-suite.types";

@Controller("applications-suite")
export class ApplicationsSuiteController {
  constructor(private readonly suite: ApplicationsSuiteService) {}

  @Get("health")
  health() {
    return this.suite.health();
  }

  @Get("applications")
  applications() {
    return this.suite.applications();
  }

  @Get("applications/:key")
  application(@Param("key") key: string) {
    return this.suite.application(key);
  }

  @Post("applications/:key/execute")
  execute(
    @Param("key") key: string,
    @Body() request: AvosApplicationExecutionRequest,
  ) {
    return this.suite.execute(key, request);
  }
}