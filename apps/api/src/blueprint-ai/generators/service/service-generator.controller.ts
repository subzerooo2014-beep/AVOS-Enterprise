import { Body, Controller, Post } from "@nestjs/common";
import { ServiceGeneratorService } from "./service-generator.service";

@Controller("generator/service")
export class ServiceGeneratorController{

 constructor(private readonly service:ServiceGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
