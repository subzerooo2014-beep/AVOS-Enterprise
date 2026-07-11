import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationsemailService } from "./integrationsemail.service";

@Controller("integrationsemail")
export class IntegrationsemailController {
  constructor(private service:IntegrationsemailService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
