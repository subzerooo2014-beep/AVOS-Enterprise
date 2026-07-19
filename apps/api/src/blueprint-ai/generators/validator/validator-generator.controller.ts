import { Body, Controller, Post } from "@nestjs/common";
import { ValidatorGeneratorService } from "./validator-generator.service";

@Controller("generator/validator")
export class ValidatorGeneratorController{

 constructor(private readonly service:ValidatorGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
