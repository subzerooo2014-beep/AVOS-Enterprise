import { Body, Controller, Get, Post } from "@nestjs/common";
import { MapsService } from "./maps.service";

@Controller("maps")
export class MapsController {
  constructor(private service:MapsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
