import { Body, Controller, Post } from "@nestjs/common";
import { PipelineOrchestratorService } from "./pipeline-orchestrator.service";

@Controller("blueprint-ai/orchestrator")
export class OrchestratorController{

 constructor(private readonly orchestrator:PipelineOrchestratorService){}

 @Post("execute")
 execute(@Body() body:{prompt:string}){
   return this.orchestrator.execute(body.prompt);
 }

}
