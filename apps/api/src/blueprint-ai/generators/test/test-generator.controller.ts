import { Body, Controller, Post } from "@nestjs/common";
import { TestGeneratorService } from "./test-generator.service";

@Controller("generator/test")
export class TestGeneratorController{

 constructor(private readonly service:TestGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
