import { Body, Controller, Post } from "@nestjs/common";
import { VersionEngineService } from "./version-engine.service";

@Controller("runtime/version-engine")
export class VersionEngineController{

 constructor(private readonly service:VersionEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
