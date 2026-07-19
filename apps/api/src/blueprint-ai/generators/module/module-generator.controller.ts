import { Body, Controller, Post } from "@nestjs/common";
import { ModuleGeneratorService } from "./module-generator.service";

@Controller("generator/module")
export class ModuleGeneratorController{

 constructor(private readonly service:ModuleGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
