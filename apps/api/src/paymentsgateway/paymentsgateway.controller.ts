import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaymentsgatewayService } from "./paymentsgateway.service";

@Controller("paymentsgateway")
export class PaymentsgatewayController{
 constructor(private service:PaymentsgatewayService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
