import { Body, Controller, Get, Post } from "@nestjs/common";
import { BillingcyclesService } from "./billingcycles.service";

@Controller("billingcycles")
export class BillingcyclesController{
 constructor(private service:BillingcyclesService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
