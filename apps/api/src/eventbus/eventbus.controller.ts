import { Body, Controller, Get, Post } from "@nestjs/common";
import { EventbusService } from "./eventbus.service";

@Controller("eventbus")
export class EventbusController{
 constructor(private service:EventbusService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
