import { Controller, Get } from "@nestjs/common";
import { ServiceGeneratorService } from "./service-generator.service";

@Controller("service-generator")
export class ServiceGeneratorController{

 constructor(private readonly service:ServiceGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
