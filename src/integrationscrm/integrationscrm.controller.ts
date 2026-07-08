import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationscrmService } from "./integrationscrm.service";

@Controller("integrationscrm")
export class IntegrationscrmController {
  constructor(private service:IntegrationscrmService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
