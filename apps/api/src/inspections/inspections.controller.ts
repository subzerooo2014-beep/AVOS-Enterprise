import { Body, Controller, Get, Post } from "@nestjs/common";
import { InspectionsService } from "./inspections.service";

@Controller("inspections")
export class InspectionsController {
  constructor(private service:InspectionsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
