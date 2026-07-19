import { Body, Controller, Post } from "@nestjs/common";
import { GraphqlGeneratorService } from "./graphql-generator.service";

@Controller("generator/graphql")
export class GraphqlGeneratorController{

 constructor(private readonly service:GraphqlGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
