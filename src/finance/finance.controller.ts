import { Body, Controller, Get, Post } from "@nestjs/common";
import { FinanceService } from "./finance.service";

@Controller("finance")
export class FinanceController {
  constructor(private service:FinanceService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
