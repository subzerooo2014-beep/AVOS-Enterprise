import { Controller, Get } from "@nestjs/common";
import { RequirementEngineService } from "./requirement-engine.service";

@Controller("requirement-engine")
export class RequirementEngineController{

 constructor(private readonly service:RequirementEngineService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
