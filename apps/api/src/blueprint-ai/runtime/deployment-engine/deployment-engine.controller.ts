import { Body, Controller, Post } from "@nestjs/common";
import { DeploymentEngineService } from "./deployment-engine.service";

@Controller("runtime/deployment-engine")
export class DeploymentEngineController{

 constructor(private readonly service:DeploymentEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
