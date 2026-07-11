import { Body, Controller, Get, Post } from "@nestjs/common";
import { ClaimsService } from "./claims.service";

@Controller("claims")
export class ClaimsController {
  constructor(private service:ClaimsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
