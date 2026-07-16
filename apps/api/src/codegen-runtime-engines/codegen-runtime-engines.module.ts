import { Module } from "@nestjs/common";
import { CodegenRuntimeEnginesController } from "./codegen-runtime-engines.controller";
import { CodegenRuntimeEnginesService } from "./codegen-runtime-engines.service";

@Module({
  controllers: [CodegenRuntimeEnginesController],
  providers: [CodegenRuntimeEnginesService],
  exports: [CodegenRuntimeEnginesService],
})
export class CodegenRuntimeEnginesModule {}