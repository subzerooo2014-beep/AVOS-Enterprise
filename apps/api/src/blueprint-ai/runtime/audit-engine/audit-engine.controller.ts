import { Body, Controller, Post } from "@nestjs/common";
import { AuditEngineService } from "./audit-engine.service";

@Controller("runtime/audit-engine")
export class AuditEngineController{

 constructor(private readonly service:AuditEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
