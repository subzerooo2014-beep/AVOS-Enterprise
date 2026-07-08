import { Body, Controller, Get, Post } from "@nestjs/common";
import { BanksService } from "./banks.service";

@Controller("banks")
export class BanksController {
  constructor(private service:BanksService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
