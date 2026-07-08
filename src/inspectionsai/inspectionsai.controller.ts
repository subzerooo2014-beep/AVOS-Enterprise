import { Body, Controller, Get, Post } from "@nestjs/common";
import { InspectionsaiService } from "./inspectionsai.service";

@Controller("inspectionsai")
export class InspectionsaiController {
  constructor(private service:InspectionsaiService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
