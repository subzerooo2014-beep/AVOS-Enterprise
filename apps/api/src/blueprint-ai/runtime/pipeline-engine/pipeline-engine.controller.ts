import { Body, Controller, Post } from "@nestjs/common";
import { PipelineEngineService } from "./pipeline-engine.service";

@Controller("runtime/pipeline-engine")
export class PipelineEngineController{

 constructor(private readonly service:PipelineEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
