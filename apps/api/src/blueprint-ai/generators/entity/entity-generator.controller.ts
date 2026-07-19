import { Body, Controller, Post } from "@nestjs/common";
import { EntityGeneratorService } from "./entity-generator.service";

@Controller("generator/entity")
export class EntityGeneratorController{

 constructor(private readonly service:EntityGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
