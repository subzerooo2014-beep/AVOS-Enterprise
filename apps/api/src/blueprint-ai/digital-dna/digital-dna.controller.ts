import { Controller, Get } from "@nestjs/common";
import { DigitalDnaService } from "./digital-dna.service";

@Controller("digital-dna")
export class DigitalDnaController{

 constructor(private readonly service:DigitalDnaService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
