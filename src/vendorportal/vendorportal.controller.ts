import { Body, Controller, Get, Post } from "@nestjs/common";
import { VendorportalService } from "./vendorportal.service";

@Controller("vendorportal")
export class VendorportalController {
  constructor(private service:VendorportalService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
