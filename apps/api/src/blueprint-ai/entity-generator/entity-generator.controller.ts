import { Controller, Get } from "@nestjs/common";
import { EntityGeneratorService } from "./entity-generator.service";

@Controller("entity-generator")
export class EntityGeneratorController{

 constructor(private readonly service:EntityGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
