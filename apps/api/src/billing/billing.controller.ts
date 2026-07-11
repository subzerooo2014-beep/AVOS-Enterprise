import { Body, Controller, Get, Post } from "@nestjs/common";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController{
 constructor(private service:BillingService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
