import { Body, Controller, Post } from "@nestjs/common";
import { EventGeneratorService } from "./event-generator.service";

@Controller("generator/event")
export class EventGeneratorController{

 constructor(private readonly service:EventGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
