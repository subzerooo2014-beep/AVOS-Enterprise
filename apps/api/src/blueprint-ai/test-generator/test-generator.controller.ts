import { Controller, Get } from "@nestjs/common";
import { TestGeneratorService } from "./test-generator.service";

@Controller("test-generator")
export class TestGeneratorController{

 constructor(private readonly service:TestGeneratorService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
