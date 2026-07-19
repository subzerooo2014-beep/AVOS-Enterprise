import { Module } from "@nestjs/common";
import { ExecutionRuntimeService } from "./execution-runtime.service";
import { ExecutionRuntimeController } from "./execution-runtime.controller";

@Module({
  providers:[ExecutionRuntimeService],
  controllers:[ExecutionRuntimeController],
  exports:[ExecutionRuntimeService]
})
export class ExecutionRuntimeModule {}
