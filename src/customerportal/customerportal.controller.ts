import { Body, Controller, Get, Post } from "@nestjs/common";
import { CustomerportalService } from "./customerportal.service";

@Controller("customerportal")
export class CustomerportalController {
  constructor(private service:CustomerportalService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
