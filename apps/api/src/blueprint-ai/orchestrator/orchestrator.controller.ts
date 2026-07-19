import { Controller, Get } from "@nestjs/common";
import { OrchestratorService } from "./orchestrator.service";

@Controller("orchestrator")
export class OrchestratorController{

 constructor(private readonly service:OrchestratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
