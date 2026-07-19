import { Module } from "@nestjs/common";
import { WorkflowRuntimeService } from "./workflow-runtime.service";
import { WorkflowRuntimeController } from "./workflow-runtime.controller";

@Module({
  providers:[WorkflowRuntimeService],
  controllers:[WorkflowRuntimeController],
  exports:[WorkflowRuntimeService]
})
export class WorkflowRuntimeModule {}
