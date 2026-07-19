import { Controller, Get } from "@nestjs/common";
import { ValidationService } from "./validation.service";

@Controller("validation")
export class ValidationController{

 constructor(private readonly service:ValidationService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
