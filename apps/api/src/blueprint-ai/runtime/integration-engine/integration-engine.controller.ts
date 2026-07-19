import { Body, Controller, Post } from "@nestjs/common";
import { IntegrationEngineService } from "./integration-engine.service";

@Controller("runtime/integration-engine")
export class IntegrationEngineController{

 constructor(private readonly service:IntegrationEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
