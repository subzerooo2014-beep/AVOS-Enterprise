import { Body, Controller, Post } from "@nestjs/common";
import { MemoryEngineService } from "./memory-engine.service";

@Controller("runtime/memory-engine")
export class MemoryEngineController{

 constructor(private readonly service:MemoryEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
