import { Body, Controller, Get, Post } from "@nestjs/common";
import { ComplianceService } from "./compliance.service";

@Controller("compliance")
export class ComplianceController {
  constructor(private service:ComplianceService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
