import { Body, Controller, Post } from "@nestjs/common";
import { SdkGeneratorService } from "./sdk-generator.service";

@Controller("generator/sdk")
export class SdkGeneratorController{

 constructor(private readonly service:SdkGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
