import { Body, Controller, Post } from "@nestjs/common";
import { CommandGeneratorService } from "./command-generator.service";

@Controller("generator/command")
export class CommandGeneratorController{

 constructor(private readonly service:CommandGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
