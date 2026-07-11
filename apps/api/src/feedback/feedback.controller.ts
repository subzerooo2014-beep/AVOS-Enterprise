import { Body, Controller, Get, Post } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";

@Controller("feedback")
export class FeedbackController {
  constructor(private service:FeedbackService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
