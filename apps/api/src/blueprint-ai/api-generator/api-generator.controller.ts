import { Controller, Get } from "@nestjs/common";
import { ApiGeneratorService } from "./api-generator.service";

@Controller("api-generator")
export class ApiGeneratorController{

 constructor(private readonly service:ApiGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
