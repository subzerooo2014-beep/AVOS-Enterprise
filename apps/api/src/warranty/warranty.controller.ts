import { Body, Controller, Get, Post } from "@nestjs/common";
import { WarrantyService } from "./warranty.service";

@Controller("warranty")
export class WarrantyController {
  constructor(private service:WarrantyService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
