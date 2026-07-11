import { Body, Controller, Get, Post } from "@nestjs/common";
import { VectordbService } from "./vectordb.service";

@Controller("vectordb")
export class VectordbController {
  constructor(private service:VectordbService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
