import { Body, Controller, Get, Post } from "@nestjs/common";
import { ExtensionsService } from "./extensions.service";

@Controller("extensions")
export class ExtensionsController{
 constructor(private service:ExtensionsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
