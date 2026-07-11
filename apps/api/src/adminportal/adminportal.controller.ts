import { Body, Controller, Get, Post } from "@nestjs/common";
import { AdminportalService } from "./adminportal.service";

@Controller("adminportal")
export class AdminportalController {
  constructor(private service:AdminportalService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
