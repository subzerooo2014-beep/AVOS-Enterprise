import { Body, Controller, Post } from "@nestjs/common";
import { DtoGeneratorService } from "./dto-generator.service";

@Controller("generator/dto")
export class DtoGeneratorController{

 constructor(private readonly service:DtoGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
