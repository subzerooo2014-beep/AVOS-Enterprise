import { Body, Controller, Get, Post } from "@nestjs/common";
import { GatewayService } from "./gateway.service";

@Controller("gateway")
export class GatewayController{
 constructor(private service:GatewayService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
