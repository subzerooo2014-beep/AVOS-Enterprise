import { Body, Controller, Post } from "@nestjs/common";
import { TaskManagerService } from "./task-manager.service";

@Controller("runtime/task-manager")
export class TaskManagerController{

 constructor(private readonly service:TaskManagerService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
