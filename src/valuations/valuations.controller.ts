import { Body, Controller, Get, Post } from "@nestjs/common";
import { ValuationsService } from "./valuations.service";

@Controller("valuations")
export class ValuationsController {
  constructor(private service:ValuationsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
