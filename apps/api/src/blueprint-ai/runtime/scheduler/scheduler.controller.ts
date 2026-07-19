import { Body, Controller, Post } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";

@Controller("runtime/scheduler")
export class SchedulerController{

 constructor(private readonly service:SchedulerService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
