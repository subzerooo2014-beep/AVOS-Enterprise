import { Body, Controller, Post } from "@nestjs/common";
import { OpenapiGeneratorService } from "./openapi-generator.service";

@Controller("generator/openapi")
export class OpenapiGeneratorController{

 constructor(private readonly service:OpenapiGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
