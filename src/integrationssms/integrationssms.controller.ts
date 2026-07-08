import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationssmsService } from "./integrationssms.service";

@Controller("integrationssms")
export class IntegrationssmsController {
  constructor(private service:IntegrationssmsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
