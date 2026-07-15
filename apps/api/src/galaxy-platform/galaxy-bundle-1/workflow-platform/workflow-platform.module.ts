import { Module } from "@nestjs/common";
import { WorkflowPlatformController } from "./workflow-platform.controller";
import { WorkflowPlatformService } from "./workflow-platform.service";

@Module({
  controllers: [WorkflowPlatformController],
  providers: [WorkflowPlatformService],
  exports: [WorkflowPlatformService],
})
export class WorkflowPlatformModule {}