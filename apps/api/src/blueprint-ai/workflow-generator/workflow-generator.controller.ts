import { Controller, Get } from "@nestjs/common";
import { WorkflowGeneratorService } from "./workflow-generator.service";

@Controller("workflow-generator")
export class WorkflowGeneratorController{

 constructor(private readonly service:WorkflowGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
