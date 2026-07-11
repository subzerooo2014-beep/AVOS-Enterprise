import { Body, Controller, Get, Post } from "@nestjs/common";
import { DiscountsService } from "./discounts.service";

@Controller("discounts")
export class DiscountsController {
  constructor(private service:DiscountsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
