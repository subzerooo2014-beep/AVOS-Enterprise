import { Body, Controller, Get, Post } from "@nestjs/common";
import { MobileapiService } from "./mobileapi.service";

@Controller("mobileapi")
export class MobileapiController {
  constructor(private service:MobileapiService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
