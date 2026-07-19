import { Body, Controller, Post } from "@nestjs/common";
import { QualityMonitorService } from "./quality-monitor.service";

@Controller("runtime/quality-monitor")
export class QualityMonitorController{

 constructor(private readonly service:QualityMonitorService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
