import { Controller, Get } from "@nestjs/common";
import { PipelineService } from "./pipeline.service";

@Controller("pipeline")
export class PipelineController{

 constructor(private readonly service:PipelineService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
