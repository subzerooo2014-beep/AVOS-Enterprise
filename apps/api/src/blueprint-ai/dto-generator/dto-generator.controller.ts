import { Controller, Get } from "@nestjs/common";
import { DtoGeneratorService } from "./dto-generator.service";

@Controller("dto-generator")
export class DtoGeneratorController{

 constructor(private readonly service:DtoGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
