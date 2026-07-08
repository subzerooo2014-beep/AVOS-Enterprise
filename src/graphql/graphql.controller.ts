import { Body, Controller, Get, Post } from "@nestjs/common";
import { GraphqlService } from "./graphql.service";

@Controller("graphql")
export class GraphqlController{
 constructor(private service:GraphqlService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
