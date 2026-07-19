import { Controller, Get } from "@nestjs/common";
import { EventGeneratorService } from "./event-generator.service";

@Controller("event-generator")
export class EventGeneratorController{

 constructor(private readonly service:EventGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
