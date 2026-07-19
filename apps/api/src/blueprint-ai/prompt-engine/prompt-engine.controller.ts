import { Controller, Get } from "@nestjs/common";
import { PromptEngineService } from "./prompt-engine.service";

@Controller("prompt-engine")
export class PromptEngineController{

 constructor(private readonly service:PromptEngineService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
