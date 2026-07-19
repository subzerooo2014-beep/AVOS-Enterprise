import { Body, Controller, Post } from "@nestjs/common";
import { CompilationPipelineService } from "./compilation-pipeline.service";

@Controller("compiler/compilation-pipeline")
export class CompilationPipelineController {

  constructor(
    private readonly service:CompilationPipelineService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
