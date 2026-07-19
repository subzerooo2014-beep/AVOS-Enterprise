import { Body, Controller, Post } from "@nestjs/common";
import { UnifiedGenerationPipelineService } from "./unified-generation-pipeline.service";

@Controller("blueprint-ai/pipeline")
export class PipelineController{

  constructor(
    private readonly pipeline:UnifiedGenerationPipelineService
  ){}

  @Post("run")
  run(@Body() body:{prompt:string}){
    return this.pipeline.run(body.prompt);
  }

}
