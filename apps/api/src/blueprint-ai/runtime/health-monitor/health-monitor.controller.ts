import { Body, Controller, Post } from "@nestjs/common";
import { HealthMonitorService } from "./health-monitor.service";

@Controller("runtime/health-monitor")
export class HealthMonitorController{

 constructor(private readonly service:HealthMonitorService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
