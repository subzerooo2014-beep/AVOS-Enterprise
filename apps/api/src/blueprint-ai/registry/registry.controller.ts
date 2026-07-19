import { Controller, Get } from "@nestjs/common";
import { RegistryService } from "./registry.service";

@Controller("registry")
export class RegistryController{

 constructor(private readonly service:RegistryService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
