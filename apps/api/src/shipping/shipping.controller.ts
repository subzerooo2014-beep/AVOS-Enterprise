import { Body, Controller, Get, Post } from "@nestjs/common";
import { ShippingService } from "./shipping.service";

@Controller("shipping")
export class ShippingController {
  constructor(private service:ShippingService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
