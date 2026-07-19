import { Body, Controller, Post } from "@nestjs/common";
import { RollbackEngineService } from "./rollback-engine.service";

@Controller("runtime/rollback-engine")
export class RollbackEngineController{

 constructor(private readonly service:RollbackEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
