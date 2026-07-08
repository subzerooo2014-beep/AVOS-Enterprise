import { Body,Controller,Get,Post } from "@nestjs/common";
import { SupportService } from "./support.service";

@Controller("support")
export class SupportController{
 constructor(private service:SupportService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
