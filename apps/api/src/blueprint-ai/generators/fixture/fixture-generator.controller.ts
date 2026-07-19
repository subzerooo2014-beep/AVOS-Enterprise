import { Body, Controller, Post } from "@nestjs/common";
import { FixtureGeneratorService } from "./fixture-generator.service";

@Controller("generator/fixture")
export class FixtureGeneratorController{

 constructor(private readonly service:FixtureGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
