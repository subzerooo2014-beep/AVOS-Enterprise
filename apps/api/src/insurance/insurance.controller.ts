import { Body, Controller, Get, Post } from "@nestjs/common";
import { InsuranceService } from "./insurance.service";

@Controller("insurance")
export class InsuranceController {
  constructor(private service:InsuranceService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
