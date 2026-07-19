import { Body, Controller, Post } from "@nestjs/common";
import { PromptToBlueprintService } from "../compiler/prompt-to-blueprint.service";
import { ProjectWriterService } from "../writer/project-writer.service";

@Controller("blueprint-ai/execute")
export class ExecutionPhaseController{

  constructor(
    private readonly compiler: PromptToBlueprintService,
    private readonly writer: ProjectWriterService
  ){}

  @Post()
  run(@Body() body:{prompt:string}){
    const bp=this.compiler.compile(body.prompt);
    return this.writer.generate(bp);
  }
}
