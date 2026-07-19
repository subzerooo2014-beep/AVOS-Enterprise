import { Body, Controller, Post } from "@nestjs/common";
import { MetricsEngineService } from "./metrics-engine.service";

@Controller("runtime/metrics-engine")
export class MetricsEngineController{

 constructor(private readonly service:MetricsEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
