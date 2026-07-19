import { Controller, Get } from "@nestjs/common";
import { ControllerGeneratorService } from "./controller-generator.service";

@Controller("controller-generator")
export class ControllerGeneratorController{

 constructor(private readonly service:ControllerGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
