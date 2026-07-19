import { Controller, Get } from "@nestjs/common";
import { DocumentationGeneratorService } from "./documentation-generator.service";

@Controller("documentation-generator")
export class DocumentationGeneratorController{

 constructor(private readonly service:DocumentationGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
