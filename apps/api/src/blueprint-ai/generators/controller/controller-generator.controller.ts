import { Body, Controller, Post } from "@nestjs/common";
import { ControllerGeneratorService } from "./controller-generator.service";

@Controller("generator/controller")
export class ControllerGeneratorController{

 constructor(private readonly service:ControllerGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
