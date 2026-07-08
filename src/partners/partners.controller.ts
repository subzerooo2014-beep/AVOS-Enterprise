import { Body, Controller, Get, Post } from "@nestjs/common";
import { PartnersService } from "./partners.service";

@Controller("partners")
export class PartnersController {
  constructor(private service:PartnersService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
