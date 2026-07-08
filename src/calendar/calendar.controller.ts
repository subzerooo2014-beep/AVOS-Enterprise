import { Body,Controller,Get,Post } from "@nestjs/common";
import { CalendarService } from "./calendar.service";

@Controller("calendar")
export class CalendarController{
 constructor(private service:CalendarService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
