import { Controller, Get } from "@nestjs/common";
import { PackagingService } from "./packaging.service";

@Controller("packaging")
export class PackagingController{

 constructor(private readonly service:PackagingService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
