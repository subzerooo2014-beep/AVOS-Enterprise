import { Body, Controller, Get, Post } from "@nestjs/common";
import { SecurityService } from "./security.service";

@Controller("security")
export class SecurityController {
  constructor(private service:SecurityService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
