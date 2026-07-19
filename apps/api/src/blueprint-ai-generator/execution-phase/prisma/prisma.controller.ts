import { Body, Controller, Post } from "@nestjs/common";
import { PrismaSchemaGeneratorService } from "./prisma-schema-generator.service";

@Controller("blueprint-ai/prisma")
export class PrismaGeneratorController{

 constructor(private readonly prisma:PrismaSchemaGeneratorService){}

 @Post()
 generate(@Body() body:{model:string}){
   return {
     schema:this.prisma.generate(body.model)
   };
 }

}
