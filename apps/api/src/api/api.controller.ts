import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiService } from "./api.service";

@Controller("api")
export class ApiController{
 constructor(private service:ApiService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
