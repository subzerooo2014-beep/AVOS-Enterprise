import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";

@Controller("appointments")
export class AppointmentsController {
  constructor(private service:AppointmentsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
