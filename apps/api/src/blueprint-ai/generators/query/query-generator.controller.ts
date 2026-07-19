import { Body, Controller, Post } from "@nestjs/common";
import { QueryGeneratorService } from "./query-generator.service";

@Controller("generator/query")
export class QueryGeneratorController{

 constructor(private readonly service:QueryGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
