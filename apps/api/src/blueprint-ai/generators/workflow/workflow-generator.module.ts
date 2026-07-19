import { Module } from "@nestjs/common";
import { WorkflowGeneratorService } from "./workflow-generator.service";
import { WorkflowGeneratorController } from "./workflow-generator.controller";

@Module({
 providers:[WorkflowGeneratorService],
 controllers:[WorkflowGeneratorController]
})
export class WorkflowGeneratorModule{}
