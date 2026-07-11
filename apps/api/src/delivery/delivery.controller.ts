import { Body, Controller, Get, Post } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";

@Controller("delivery")
export class DeliveryController {
  constructor(private service:DeliveryService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
