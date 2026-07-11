import { Body, Controller, Get, Post } from "@nestjs/common";
import { TrackingService } from "./tracking.service";

@Controller("tracking")
export class TrackingController {
  constructor(private service:TrackingService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
