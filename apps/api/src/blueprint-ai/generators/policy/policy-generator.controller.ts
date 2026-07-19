import { Body, Controller, Post } from "@nestjs/common";
import { PolicyGeneratorService } from "./policy-generator.service";

@Controller("generator/policy")
export class PolicyGeneratorController{

 constructor(private readonly service:PolicyGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
