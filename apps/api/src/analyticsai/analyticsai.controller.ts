import { Body, Controller, Get, Post } from "@nestjs/common";
import { AnalyticsaiService } from "./analyticsai.service";

@Controller("analyticsai")
export class AnalyticsaiController {
  constructor(private service:AnalyticsaiService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
