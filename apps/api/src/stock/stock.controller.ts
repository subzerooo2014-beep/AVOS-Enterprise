import { Body, Controller, Get, Post } from "@nestjs/common";
import { StockService } from "./stock.service";

@Controller("stock")
export class StockController {
  constructor(private service:StockService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
