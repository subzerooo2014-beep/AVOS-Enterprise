import { Body, Controller, Get, Post } from "@nestjs/common";
import { DealerportalService } from "./dealerportal.service";

@Controller("dealerportal")
export class DealerportalController {
  constructor(private service:DealerportalService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
