import { Controller, Get } from "@nestjs/common";
import { CapabilityMapperService } from "./capability-mapper.service";

@Controller("capability-mapper")
export class CapabilityMapperController{

 constructor(private readonly service:CapabilityMapperService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
