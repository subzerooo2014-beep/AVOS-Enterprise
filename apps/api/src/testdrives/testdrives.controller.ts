import { Body, Controller, Get, Post } from "@nestjs/common";
import { TestdrivesService } from "./testdrives.service";

@Controller("testdrives")
export class TestdrivesController {
  constructor(private service:TestdrivesService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
