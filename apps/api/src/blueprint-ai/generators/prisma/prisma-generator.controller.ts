import { Body, Controller, Post } from "@nestjs/common";
import { PrismaGeneratorService } from "./prisma-generator.service";

@Controller("generator/prisma")
export class PrismaGeneratorController{

 constructor(private readonly service:PrismaGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
