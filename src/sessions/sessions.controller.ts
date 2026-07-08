import { Body, Controller, Get, Post } from "@nestjs/common";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(private service:SessionsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
