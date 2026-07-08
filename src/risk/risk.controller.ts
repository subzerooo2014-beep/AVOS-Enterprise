import { Body, Controller, Get, Post } from "@nestjs/common";
import { RiskService } from "./risk.service";

@Controller("risk")
export class RiskController {
  constructor(private service:RiskService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
