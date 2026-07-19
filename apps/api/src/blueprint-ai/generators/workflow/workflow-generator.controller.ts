import { Body, Controller, Post } from "@nestjs/common";
import { WorkflowGeneratorService } from "./workflow-generator.service";

@Controller("generator/workflow")
export class WorkflowGeneratorController{

 constructor(private readonly service:WorkflowGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
