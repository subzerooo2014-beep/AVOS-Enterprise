import { Body, Controller, Get, Post } from "@nestjs/common";
import { LocalesService } from "./locales.service";

@Controller("locales")
export class LocalesController{
 constructor(private service:LocalesService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
