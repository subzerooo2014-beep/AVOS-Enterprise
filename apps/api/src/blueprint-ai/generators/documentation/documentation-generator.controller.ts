import { Body, Controller, Post } from "@nestjs/common";
import { DocumentationGeneratorService } from "./documentation-generator.service";

@Controller("generator/documentation")
export class DocumentationGeneratorController{

 constructor(private readonly service:DocumentationGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
