import { Body, Controller, Get, Post } from "@nestjs/common";
import { VendorsService } from "./vendors.service";

@Controller("vendors")
export class VendorsController {
  constructor(private service:VendorsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
