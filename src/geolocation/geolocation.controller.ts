import { Body, Controller, Get, Post } from "@nestjs/common";
import { GeolocationService } from "./geolocation.service";

@Controller("geolocation")
export class GeolocationController {
  constructor(private service:GeolocationService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
