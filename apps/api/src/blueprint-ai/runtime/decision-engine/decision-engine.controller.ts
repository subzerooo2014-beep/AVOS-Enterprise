import { Body, Controller, Post } from "@nestjs/common";
import { DecisionEngineService } from "./decision-engine.service";

@Controller("runtime/decision-engine")
export class DecisionEngineController{

 constructor(private readonly service:DecisionEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
