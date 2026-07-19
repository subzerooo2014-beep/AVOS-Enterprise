import { Body, Controller, Post } from "@nestjs/common";
import { MapperGeneratorService } from "./mapper-generator.service";

@Controller("generator/mapper")
export class MapperGeneratorController{

 constructor(private readonly service:MapperGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
