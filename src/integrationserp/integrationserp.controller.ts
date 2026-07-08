import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationserpService } from "./integrationserp.service";

@Controller("integrationserp")
export class IntegrationserpController {
  constructor(private service:IntegrationserpService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
