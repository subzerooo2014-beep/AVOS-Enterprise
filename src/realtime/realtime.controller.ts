import { Body, Controller, Get, Post } from "@nestjs/common";
import { RealtimeService } from "./realtime.service";

@Controller("realtime")
export class RealtimeController{
 constructor(private service:RealtimeService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
