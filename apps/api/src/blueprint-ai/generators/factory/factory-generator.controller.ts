import { Body, Controller, Post } from "@nestjs/common";
import { FactoryGeneratorService } from "./factory-generator.service";

@Controller("generator/factory")
export class FactoryGeneratorController{

 constructor(private readonly service:FactoryGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
