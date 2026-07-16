import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CodegenRuntimeEnginesService } from "./codegen-runtime-engines.service";
import { CodegenRuntimeEnginesCapability } from "./codegen-runtime-engines.types";

@Controller("codegen-runtime-engines")
export class CodegenRuntimeEnginesController {
  constructor(private readonly service: CodegenRuntimeEnginesService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Post("execute/:capability")
  execute(
    @Param("capability") capability: CodegenRuntimeEnginesCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}