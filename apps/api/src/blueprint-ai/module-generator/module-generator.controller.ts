import { Controller, Get } from "@nestjs/common";
import { ModuleGeneratorService } from "./module-generator.service";

@Controller("module-generator")
export class ModuleGeneratorController{

 constructor(private readonly service:ModuleGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
