import { Body, Controller, Get, Post } from "@nestjs/common";
import { TranslationService } from "./translation.service";

@Controller("translation")
export class TranslationController {
  constructor(private service:TranslationService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
