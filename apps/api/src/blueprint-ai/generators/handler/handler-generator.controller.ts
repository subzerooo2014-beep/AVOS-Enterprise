import { Body, Controller, Post } from "@nestjs/common";
import { HandlerGeneratorService } from "./handler-generator.service";

@Controller("generator/handler")
export class HandlerGeneratorController{

 constructor(private readonly service:HandlerGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
