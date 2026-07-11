import { Body, Controller, Get, Post } from "@nestjs/common";
import { MultitenancyService } from "./multitenancy.service";

@Controller("multitenancy")
export class MultitenancyController{
 constructor(private service:MultitenancyService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
