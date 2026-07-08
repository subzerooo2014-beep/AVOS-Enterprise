import { Body,Controller,Get,Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController{
 constructor(private service:AiService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
