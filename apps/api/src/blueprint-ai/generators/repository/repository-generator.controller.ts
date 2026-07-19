import { Body, Controller, Post } from "@nestjs/common";
import { RepositoryGeneratorService } from "./repository-generator.service";

@Controller("generator/repository")
export class RepositoryGeneratorController{

 constructor(private readonly service:RepositoryGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
