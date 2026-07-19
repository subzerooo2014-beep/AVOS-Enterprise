import { Body, Controller, Post } from "@nestjs/common";
import { PlanningEngineService } from "./planning-engine.service";

@Controller("runtime/planning-engine")
export class PlanningEngineController{

 constructor(private readonly service:PlanningEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
