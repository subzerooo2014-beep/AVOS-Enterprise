import { Body, Controller, Post } from "@nestjs/common";
import { OptimizationEngineService } from "./optimization-engine.service";

@Controller("runtime/optimization-engine")
export class OptimizationEngineController{

 constructor(private readonly service:OptimizationEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
