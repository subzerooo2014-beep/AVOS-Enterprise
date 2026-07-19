import { Body, Controller, Post } from "@nestjs/common";
import { SecurityEngineService } from "./security-engine.service";

@Controller("runtime/security-engine")
export class SecurityEngineController{

 constructor(private readonly service:SecurityEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
