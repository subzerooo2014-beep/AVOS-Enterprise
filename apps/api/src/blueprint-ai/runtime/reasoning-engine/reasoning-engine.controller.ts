import { Body, Controller, Post } from "@nestjs/common";
import { ReasoningEngineService } from "./reasoning-engine.service";

@Controller("runtime/reasoning-engine")
export class ReasoningEngineController{

 constructor(private readonly service:ReasoningEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
