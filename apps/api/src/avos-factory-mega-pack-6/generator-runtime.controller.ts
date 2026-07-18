import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  GeneratorDescriptor,
  GeneratorExecutionRequest
} from "./generator-runtime.contracts";
import { GeneratorRuntimeService } from "./generator-runtime.service";

@Controller("avos/factory/generator-runtime")
export class GeneratorRuntimeController {
  constructor(private readonly runtime: GeneratorRuntimeService) {}

  @Get("status")
  getStatus() {
    return this.runtime.getStatus();
  }

  @Get("metrics")
  getMetrics() {
    return this.runtime.getMetrics();
  }

  @Get("generators")
  listGenerators() {
    return this.runtime.listGenerators();
  }

  @Get("executions")
  listExecutions() {
    return this.runtime.listExecutions();
  }

  @Get("artifacts")
  listArtifacts() {
    return this.runtime.listArtifacts();
  }

  @Post("generators")
  registerGenerator(@Body() input: GeneratorDescriptor) {
    return this.runtime.registerGenerator(input);
  }

  @Post("generators/:id/validate")
  validateGenerator(@Param("id") id: string) {
    return this.runtime.validateGenerator(id);
  }

  @Post("generators/:id/certify")
  certifyGenerator(
    @Param("id") id: string,
    @Body() body: { approvedBy: string }
  ) {
    return this.runtime.certifyGenerator(id, body.approvedBy);
  }

  @Post("execute")
  execute(@Body() request: GeneratorExecutionRequest) {
    return this.runtime.execute(request);
  }

  @Post("executions/:id/retry")
  retry(@Param("id") id: string) {
    return this.runtime.retry(id);
  }

  @Post("smoke")
  smoke() {
    return this.runtime.runSmoke();
  }
}
