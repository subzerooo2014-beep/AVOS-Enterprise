import { Body, Controller, Post } from "@nestjs/common";
import { ExecutionEngineService } from "./execution-engine.service";

@Controller("runtime/execution-engine")
export class ExecutionEngineController{

 constructor(private readonly service:ExecutionEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
