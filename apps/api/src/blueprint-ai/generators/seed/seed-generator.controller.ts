import { Body, Controller, Post } from "@nestjs/common";
import { SeedGeneratorService } from "./seed-generator.service";

@Controller("generator/seed")
export class SeedGeneratorController{

 constructor(private readonly service:SeedGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
