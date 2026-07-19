import { Body, Controller, Post } from "@nestjs/common";
import { CrudScaffoldService } from "./crud-scaffold.service";

@Controller("blueprint-ai/crud")
export class CrudGeneratorController{

 constructor(private readonly crud:CrudScaffoldService){}

 @Post()
 generate(@Body() body:{resource:string}){
   return this.crud.generate(body.resource);
 }
}
