import { Module } from "@nestjs/common";
import { SalesWorkflowService } from "./sales-workflow.service";

@Module({
  providers:[SalesWorkflowService],
  exports:[SalesWorkflowService],
})
export class SalesWorkflowModule {}
