import { Body, Controller, Post } from "@nestjs/common";
import { TelemetryEngineService } from "./telemetry-engine.service";

@Controller("runtime/telemetry-engine")
export class TelemetryEngineController{

 constructor(private readonly service:TelemetryEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
