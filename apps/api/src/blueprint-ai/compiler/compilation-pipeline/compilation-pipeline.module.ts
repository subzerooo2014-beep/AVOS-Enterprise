import { Module } from "@nestjs/common";
import { CompilationPipelineService } from "./compilation-pipeline.service";
import { CompilationPipelineController } from "./compilation-pipeline.controller";

@Module({
  providers:[CompilationPipelineService],
  controllers:[CompilationPipelineController],
  exports:[CompilationPipelineService]
})
export class CompilationPipelineModule {}
