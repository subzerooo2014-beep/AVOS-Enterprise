import { Controller, Get } from "@nestjs/common";
import { PrismaGeneratorService } from "./prisma-generator.service";

@Controller("prisma-generator")
export class PrismaGeneratorController{

 constructor(private readonly service:PrismaGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
