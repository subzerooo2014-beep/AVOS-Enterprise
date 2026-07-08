import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommissionsService } from "./commissions.service";

@Controller("commissions")
export class CommissionsController {
  constructor(private service:CommissionsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
