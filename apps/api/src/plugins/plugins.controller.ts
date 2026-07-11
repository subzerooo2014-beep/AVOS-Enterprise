import { Body, Controller, Get, Post } from "@nestjs/common";
import { PluginsService } from "./plugins.service";

@Controller("plugins")
export class PluginsController{
 constructor(private service:PluginsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
