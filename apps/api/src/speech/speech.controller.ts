import { Body, Controller, Get, Post } from "@nestjs/common";
import { SpeechService } from "./speech.service";

@Controller("speech")
export class SpeechController {
  constructor(private service:SpeechService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
