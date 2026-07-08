import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationspaymentService } from "./integrationspayment.service";

@Controller("integrationspayment")
export class IntegrationspaymentController {
  constructor(private service:IntegrationspaymentService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
