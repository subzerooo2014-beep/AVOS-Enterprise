import { Body, Controller, Post } from "@nestjs/common";
import { NestModuleScaffoldService } from "./nest-module-scaffold.service";

@Controller("blueprint-ai/scaffold")
export class ScaffoldController{
 constructor(private readonly scaffold:NestModuleScaffoldService){}

 @Post()
 create(@Body() body:{project:string}){
   return this.scaffold.generate(body.project);
 }
}
