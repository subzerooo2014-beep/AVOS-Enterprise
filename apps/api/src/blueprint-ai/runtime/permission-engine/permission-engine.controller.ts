import { Body, Controller, Post } from "@nestjs/common";
import { PermissionEngineService } from "./permission-engine.service";

@Controller("runtime/permission-engine")
export class PermissionEngineController{

 constructor(private readonly service:PermissionEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
