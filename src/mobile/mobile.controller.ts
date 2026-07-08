import { Body, Controller, Get, Post } from "@nestjs/common";
import { MobileService } from "./mobile.service";

@Controller("mobile")
export class MobileController {
  constructor(private service:MobileService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
