import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrenciesService } from "./currencies.service";

@Controller("currencies")
export class CurrenciesController{
 constructor(private service:CurrenciesService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
