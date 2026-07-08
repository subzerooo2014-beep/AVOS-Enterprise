import { Body, Controller, Get, Post } from "@nestjs/common";
import { AttachmentsService } from "./attachments.service";

@Controller("attachments")
export class AttachmentsController {
  constructor(private service:AttachmentsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
