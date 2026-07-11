import { Body, Controller, Get, Post } from "@nestjs/common";
import { PricingService } from "./pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private service:PricingService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
